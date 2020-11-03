import { GetServerSideProps } from "next"
import React from "react"
import BuildFormPage from "../../../components/BuildFormPage"
import Layout from "../../../components/Layout"
import { connectDB } from "../../../db"
import { Build } from "../../../db/entities/build.entity"
import { IBuildWithJson } from "../../../types"

interface IBuildsEditPageProps {
  build?: IBuildWithJson
  errors?: string
}

const BuildsEditPage: React.FC<IBuildsEditPageProps> = ({ build, errors }) => {
  if (errors || !build) {
    return (
      <Layout title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return <BuildFormPage type="EDIT" build={build} />
}

export default BuildsEditPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id

    const connection = await connectDB()

    const buildsRepository = connection!.getRepository(Build)
    const build = await buildsRepository
      .findOne(id as string)
      .catch((error) => {
        console.error(error)
        throw new Error("Cannot find build data")
      })

    if (!build) throw new Error("Build not found")

    return {
      props: { build: JSON.parse(JSON.stringify(build)) },
    }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}