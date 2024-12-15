import GetBatch from "./get-batch";

export default async function DetailProduct({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return <GetBatch id={id} />
}
