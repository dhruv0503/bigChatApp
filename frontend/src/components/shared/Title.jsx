import React from 'react'
import {Helmet} from "react-helmet-async";

const Title = ({title = "Chat App", description = "This is an epic description"}) => {
  return (
    <Helmet>
        <title>
            {title}
        </title>
        <meta name="description" content={description} />
    </Helmet>
  )
}

export default Title
