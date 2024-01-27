import fs from "fs";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

interface Props {
  mdxSource: MDXRemoteSerializeResult;
}

export default function RemoteMdxPage({ mdxSource }: Props) {
  return <MDXRemote {...mdxSource} />;
}

export async function getStaticProps() {
  // MDX text - can be from a local file, database, CMS, fetch, anywhere...
  //   const res = await fetch("/src/shop/custom/about");
  //   const mdxText = await res.text();
  const source = fs.readFileSync(`_posts/about.mdx`);
  const mdxSource = await serialize(source);
  return { props: { mdxSource } };
}
