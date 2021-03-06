import React from "react"
import { IBuild } from "../../types"
import * as SC from "./build-card.styles"
import Link from "next/link"

interface IBuildCardProps {
  name: IBuild["name"]
  categories: IBuild["categories"]
  id: IBuild["id"]
}

function BuildCard({
  name,
  categories = [],
  id,
}: IBuildCardProps): JSX.Element {
  return (
    <SC.BuildCardWrapper>
      <SC.Content>
        <SC.Title>
          <Link href={`/builds/${id}`}>{name}</Link>
        </SC.Title>
        <SC.Categories>
          {categories.map((category) => {
            return <SC.CategoryPill key={category}>{category}</SC.CategoryPill>
          })}
        </SC.Categories>
      </SC.Content>
    </SC.BuildCardWrapper>
  )
}

export default BuildCard
