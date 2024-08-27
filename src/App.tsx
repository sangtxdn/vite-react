import { useState } from 'react'
import './index.css'
import { BlockLayout } from './BlockLayout'
import { FieldInstance } from './types'
import { CreateFieldModal } from './CreateFieldModal'
import {Button, ConfigProvider } from 'antd';
import { CloseOutlined, PicLeftOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { fieldType } from './constants'
import { prettyPrintJson } from 'pretty-print-json';

function App() {
  const [data, setData] = useState<{
    header: FieldInstance[];
    body: Record<string, string>;
  }>({
    header: [],
    body: {}
  })
  const handleAddItem = (item: FieldInstance) => {
    const newHeader = [...data.header, item]
    setData({
      ...data,
      header: newHeader,
    })
  }

  const handleRemoveItem = (itemId: string) => {
    const newHeader = data.header.filter(item => item.id !== itemId)
    setData({
      ...data,
      header: newHeader,
    })
  }

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadNode = document.createElement('a');
    downloadNode.setAttribute("href",     dataStr);
    downloadNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadNode);
    downloadNode.click();
    downloadNode.remove();
  }

  const handleNext = () => {
    window.alert("Next")
  }

  const headerItems = data.header.map(field => (<div key={field.id} className='bg-white p-2 rounded flex items-center justify-between'>
    {field.type === fieldType.number ? <UnorderedListOutlined className='text-gray-700 pr-2' /> : <PicLeftOutlined className='text-gray-700 pr-2' />}
    <p className='text-black flex-1'>{field.label}</p>
    <p className='text-gray-700 w-1/3'>{field.offsetsExpression.start}:{field.offsetsExpression.end}({Number(field.offsetsExpression.end) - Number(field.offsetsExpression.start) + 1})</p>
    <Button type="text" className='!p-0 rounded border-gray-400 h-auto overflow-hidden' onClick={() => handleRemoveItem(field.id)}>
      <CloseOutlined className='text-gray-400' />
    </Button>
  </div>))

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: '#fb923c',
          borderRadius: 8,
        },
      }}
    >
      <>
        <div className='flex gap-4 bg-gray-200 h-[calc(100vh-72px)] overflow-auto justify-center items-start p-4'>
          <div className='w-2/3'>
            <BlockLayout title='Canvas' >
              <div className='flex flex-col gap-4'>
                {/* Header */}
                <div className='flex items-center relative'>
                  <div className='bg-gray-800 rounded-lg relative right-[-2px] flex flex-1'>
                    <div className='bg-white rounded-lg relative right-[2px] pr-1 flex flex-1'>
                      <div className='bg-gray-800 rounded-lg p-2 flex-1'>
                        <div className='h-72 overflow-auto flex gap-1 flex-col'>
                          {headerItems}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='relative right-[-6px]'>
                    <div className='text-orientation-mixed tracking-wide text-center pointer-events-none'>Header</div>
                  </div>
                  <div className='absolute right-0 bottom-0'>
                    <CreateFieldModal handleAddItem={handleAddItem} />
                  </div>
                </div>
                {/* Body */}
                <div className='flex items-center relative'>
                  <div className='bg-white rounded-lg relative right-[-2px] flex flex-1 h-40'>
                  </div>
                  <div className='relative right-[-6px]'>
                    <div className='text-orientation-mixed tracking-wide text-center pointer-events-none'>Body</div>
                  </div>
                </div>
              </div>
            </BlockLayout>
          </div>
          <div className='w-1/3'>
            <BlockLayout title='Editor' handleDownload={handleDownloadJson}>
              <div className='h-[480px] overflow-auto'>
                <div className='whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(data)}} />
              </div>
            </BlockLayout>
          </div>
        </div>
        <div className='flex gap-4 justify-end p-4'>
          <Button size='large' key="back" type='text' className='bg-gray-400 text-white' >
            Previous
          </Button>
          <Button size='large' key="submit" className='bg-orange-400 text-white' onClick={handleNext}>
            Next
          </Button>
        </div>
      </>
    </ConfigProvider>
  )
}

export default App
