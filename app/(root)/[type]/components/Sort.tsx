"use client"
import React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from 'next/navigation'
import { sortTypes } from '@/constants'


const Sort = () => {
  const router = useRouter()
  const path = usePathname()

  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`)
  }

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="shad-no-focus h-11 w-full rounded-[8px] border-transparent bg-white !shadow-drop-3">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className='!shadow-drop-3'>
        {sortTypes.map(type =>
          <SelectItem key={type.label} value={type.value} className='shad-select-item'>{type.label} </SelectItem>
        )}
      </SelectContent>
    </Select>

  )
}

export default Sort