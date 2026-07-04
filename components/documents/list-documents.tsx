"use client"

import { getListDocuments } from "@/lib/api/documents";
import { useEffect } from "react"

export function ListDocuments() {
  useEffect(() => {
    getListDocuments().then((value) => console.log(value));
  }, [])

  return (
    <></>
  )
}
