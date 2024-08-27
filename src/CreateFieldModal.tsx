import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Input, InputNumber as InputNumberAntd } from 'antd';
import { useState } from 'react';
import { useController, UseControllerProps, useForm } from 'react-hook-form';
import { Field, FieldInstance } from './types';
import { v4 as uuidv4 } from 'uuid';
import { fieldType } from './constants';

const { TextArea } = Input;

function InputText(props: UseControllerProps<Field>) {
  const { field, fieldState } = useController(props)
  return (
    <div>
      <Input size='large' {...field} status={fieldState.error ? "error" : ""} maxLength={35}/>
      <p className='text-red-400'>{fieldState.error?.message ?? ""}</p>
    </div>
  )
}

function InputNumber(props: UseControllerProps<Field>) {
  const { field, fieldState } = useController(props)
  const error = useController({ control: props.control, name: "error" })
  return (
    <div>
      <InputNumberAntd size='large' {...field} min={'0'} onChange={(val) => {
        field.onChange(val);
        error.field.onChange("");
      }} status={fieldState.error || error.fieldState.error ? "error" : ""}/>
      <p className='text-red-400'>{fieldState.error?.message ?? ""}</p>
    </div>
  )
}

function InputArea(props: UseControllerProps<Field>) {
  const { field, fieldState } = useController(props)
  return (
    <div>
      <TextArea {...field} placeholder="Add description" rows={4} status={fieldState.error ? "error" : ""}/>
      <p className='text-red-400'>{fieldState.error?.message ?? ""}</p>
    </div>
  )
}

function Label({ label, isRequired, className }: { label: string, isRequired?: boolean, className?: string}) {
  return (
    <p className={`${className ?? ""} text-base flex items-center justify-start`}>{isRequired && <span className='text-red-400'>*</span>}{label}</p>
  )
}

function FieldType(props: UseControllerProps<Field>) {
  const { field, fieldState } = useController(props)
  const options = [{ label: "Number", value: fieldType.number }, { label: "String", value: fieldType.string }]
  return (
    <div>
      <Select size='large' options={options} {...field} className='w-full text-sm' status={fieldState.error ? "error" : ""} />
      <p className='text-red-400'>{fieldState.error?.message ?? ""}</p>
    </div>
  )
}

export const CreateFieldModal = ({ handleAddItem }: { handleAddItem: (arg0: FieldInstance) => void}) => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const { handleSubmit, control, reset, setError  } = useForm<Field>({
    defaultValues: {
      id: "",
      fieldName: "",
      fieldType: "",
      from: "",
      to: "",
      description: "",
      error: "",
    },
    mode: "onSubmit"
  })

  const onSubmit = (data: Field) => {
    if (data.from >= data.to) {
      setError("error", { type: "custom", message: "From must less than To" })
      return
    }
    const submitData: FieldInstance = {
      id: uuidv4(),
      label: data.fieldName,
      type: data.fieldType,
      offsetsExpression: {
        type: "StaticOffsets",
        start: Number(data.from),
        end: Number(data.to),
      },
      constraints: {
        description: data.description
      }
    }
    handleAddItem(submitData);
    handleCancel();
  }


  const handleCancel = () => {
    reset();
    setOpen(false);
  };
  const error = useController({ control, name: "error" })
  return(
    <>
      <Button type="text" className='!p-0 rounded-full border border-white h-auto overflow-hidden' onClick={showModal}>
        <PlusCircleOutlined className='text-orange-400 bg-orange-100' />
      </Button>
      <Modal
        open={open}
        title={<p className='text-xl font-bold'>Field Declaration</p>}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4 pt-4'>
            <Label label='Field name' isRequired />
            <InputText control={control} name="fieldName" rules={{ required: "Required" }} />
            <Label label='Type' isRequired />
            <FieldType control={control} name="fieldType" rules={{ required: "Required" }} />
            <Label label='Offset' isRequired />
            <div>

            <div className='flex items-start justify-start gap-4'>
              <div className='flex items-start justify-start gap-2'>
                <Label label='From' className='mt-2' />
                <InputNumber control={control} name="from" rules={{ required: "Required" }} />
              </div>
              <div className='flex items-start justify-start gap-2'>
                <Label label='To' className='mt-2' />
                <InputNumber control={control} name="to" rules={{ required: "Required" }} />
              </div>
            </div>
            <p className='text-red-400'>{error?.fieldState?.error?.message}</p>
            </div>
            <Label label='Description'/>
            <InputArea control={control} name="description"/>
          </div>
          <div className='flex gap-4 justify-end mt-4'>
            <Button size='large' key="back" type='text' className='bg-gray-400 text-white' onClick={handleCancel}>
              Cancel
            </Button>
            <Button size='large' key="submit" className='bg-orange-400 text-white' onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}