
export type Field = {
  id: string;
  fieldName: string;
  fieldType: string;
  from: string;
  to: string;
  description: string;
  error?: string;
}

export type FieldInstance = {
  id: string;
  type: string;
  label: string;
  offsetsExpression: {
    type: string;
    start: number;
    end: number;
  },
  constraints?: Record<string, string>
}
