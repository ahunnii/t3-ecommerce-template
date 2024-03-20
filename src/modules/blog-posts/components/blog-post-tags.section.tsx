type Props = {
  tags: string[];
};

export const BlogPostTagsSection = ({ tags }: Props) => {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 ">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="rounded-md bg-gray-200 px-2 py-1 font-semibold text-gray-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
