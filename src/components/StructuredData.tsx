import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, unknown>
  id?: string
}

export default function StructuredData({ data, id }: StructuredDataProps) {
  return (
    <Script
      id={id || 'structured-data'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  )
}

// komponen khusus buat multiple structured data
interface MultipleStructuredDataProps {
  schemas: Record<string, unknown>[]
}

export function MultipleStructuredData({ schemas }: MultipleStructuredDataProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <StructuredData
          key={index}
          data={schema}
          id={`structured-data-${index}`}
        />
      ))}
    </>
  )
}