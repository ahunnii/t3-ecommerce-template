import parse from "html-react-parser";
import { cn } from "~/utils/styles";

type Props = {
  content: string | undefined | null;
};

export const BlogPostContentSection = ({ content }: Props) => {
  const isContentInvalid =
    content === "" || content === null || content?.length === 0;

  if (isContentInvalid)
    return (
      <p>
        There seems to be an error fetching the blog article. Please refresh and
        try again.
      </p>
    );
  return <div className={cn("", "")}>{parse(content ?? "")}</div>;
};
