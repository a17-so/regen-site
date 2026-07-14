// Emits a JSON-LD structured-data block. Server component; the object is
// serialized at render time. Structured data is normal-SEO helpful (not an
// AI-features magic bullet), so keep it faithful to what's on the page.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
