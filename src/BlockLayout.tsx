import { DownloadOutlined } from "@ant-design/icons"
import React from "react"

type Props = {
  title: string
  children: React.ReactElement
  handleDownload?: () => void
}
export const BlockLayout = ({
  title,
  children,
  handleDownload
}: Props) => {
  return(
    <div className="bg-white rounded-lg shadow flex-1">
      <div className="border-b border-b-gray-400 flex items-center justify-between">
        <div className="text-orange-400 border-b-[3px] border-b-orange-400 px-4 py-2 relative top-[1px]">
          {title}
        </div>
        {!!handleDownload && (<DownloadOutlined className='text-gray-700 pr-4' onClick={handleDownload} />)}
      </div>
      <div className="p-4 pt-3 pb-4">
        {children}
      </div>
    </div>
  )
}