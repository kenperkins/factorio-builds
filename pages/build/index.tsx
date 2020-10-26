import { GetServerSideProps } from "next"
import Link from "next/link"

import { IBuild } from "../../types"
import Layout from "../../components/Layout"
import ListBuild from "../../components/ListBuild"
import { initializeStore } from "../../redux/store"
import { connectDB } from "../../db"
import { Build } from "../../db/entities/build.entity"

interface IBuildsIndexPageProps {
  items: IBuild[]
}

const BuildsIndexPage: React.FC<IBuildsIndexPageProps> = ({ items }) => (
  <Layout title="Builds">
    <h1>Builds List</h1>
    <p>You are currently on: /build</p>
    <ListBuild items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  const connection = await connectDB()
  const buildsRepository = connection!.getRepository(Build)

  const builds = await buildsRepository.find().catch((error) => {
    console.error(error)
    throw new Error("Cannot find build data")
  })

  dispatch({
    type: "SET_BUILDS",
    // TODO: fix type
    // @ts-ignore
    payload: builds,
  })

  return { props: { items: JSON.parse(JSON.stringify(builds)) } }
}

export default BuildsIndexPage
