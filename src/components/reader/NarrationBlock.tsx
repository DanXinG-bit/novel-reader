interface Props {
  content: string;
}

export function NarrationBlock({ content }: Props) {
  return (
    <p className="narration-block">{content}</p>
  );
}
