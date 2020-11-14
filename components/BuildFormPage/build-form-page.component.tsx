import React, { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { ECategory, EState, IBuild } from "../../types"
import { isValidBlueprint } from "../../utils/blueprint"
import Layout from "../Layout"
import Step1 from "./step-1.component"
import Step2 from "./step-2.component"

export interface IFormValues {
  name: string
  blueprint: string
  description: string
  state: EState | -1
  tileable: boolean
  categories: ECategory[]
  image: File | string | null
}

interface IValidFormValues {
  name: string
  blueprint: string
  description: string
  state: EState
  tileable: boolean
  categories: ECategory[]
  image: File
}

const FILE_SIZE = 160 * 1024
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"]

const baseInitialValues: IFormValues = {
  name: "",
  blueprint: "",
  description: "",
  state: -1,
  tileable: false,
  categories: [],
  image: null,
}

const createInitialValues = (build?: IBuild): IFormValues => {
  if (!build) {
    return baseInitialValues
  }

  return {
    name: build.name,
    blueprint: build.blueprint,
    description: build.description,
    state: build.metadata.state,
    tileable: build.metadata.tileable,
    categories: build.metadata.categories,
    image: build.image.src,
  }
}

const validation = {
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  blueprint: Yup.string()
    .required("Required")
    .test("valid", "Invalid blueprint string", (blueprint) => {
      if (!blueprint) {
        return false
      }
      return isValidBlueprint(blueprint)
    }),
  description: Yup.string(),
  state: Yup.string().oneOf(Object.keys(EState), "Required"),
  tileable: Yup.boolean(),
  categories: Yup.array(),
  image: Yup.mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
}

// TODO: validate image
export const validate = (fieldName: keyof IFormValues) => async (
  value: string
): Promise<any> => {
  try {
    await validation[fieldName].validate(value)
    return
  } catch (err) {
    return err.message
  }
}

const toFormData = (formValues: IValidFormValues) => {
  const formData = new FormData()

  formData.append("name", formValues.name)
  formData.append("blueprint", formValues.blueprint)
  formData.append("description", formValues.description)
  formData.append("state", formValues.state)
  formData.append("tileable", String(formValues.tileable))
  formData.append("categories", JSON.stringify(formValues.categories))
  formData.append("image", formValues.image)

  return formData
}

interface IBuildFormPageCreating {
  type: "CREATE"
  build?: undefined
}

interface IBuildFormPageEditing {
  type: "EDIT"
  build: IBuild
}

type TBuildFormPage = IBuildFormPageCreating | IBuildFormPageEditing

const BuildFormPage: React.FC<TBuildFormPage> = (props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [step, setStep] = useState<1 | 2>(1)

  const initialValues = createInitialValues(props.build)

  const goToNextStep = useCallback(() => {
    setStep(2)
  }, [])

  return (
    <Formik<IFormValues>
      initialValues={initialValues}
      onSubmit={(values) => {
        const endpoint =
          props.type === "EDIT" ? `build/${props.build.id}` : `build`
        axios({
          url: `http://localhost:3000/api/${endpoint}`,
          method: props.type === "EDIT" ? "PUT" : "POST",
          data: toFormData(values as IValidFormValues),
        })
          .then((res) => {
            if (props.type === "EDIT") {
              dispatch({
                type: "EDIT_BUILD",
                payload: res.data,
              })
            } else {
              dispatch({
                type: "CREATE_BUILD",
                payload: res.data,
              })
            }
            router.push("/")
          })
          .catch((err) => {
            // TODO: handle me
            console.log(err)
          })
      }}
    >
      {(formikProps) => {
        return (
          <Layout
            title="Create a build"
            /* TODO: extract style */
            subheader={
              <h2 style={{ fontSize: "24px", fontWeight: 700 }}>
                {props.type === "CREATE" ? "Create a build" : "Edit build"}
              </h2>
            }
          >
            <Form>
              {step === 1 && props.type === "CREATE" && (
                <Step1 formikProps={formikProps} goToNextStep={goToNextStep} />
              )}

              {(step === 2 || props.type === "EDIT") && (
                <Step2 formikProps={formikProps} />
              )}
            </Form>
          </Layout>
        )
      }}
    </Formik>
  )
}

export default BuildFormPage
