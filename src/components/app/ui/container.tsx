interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className="mx-auto h-full w-full max-w-7xl">{children}</div>;
};

export default Container;
