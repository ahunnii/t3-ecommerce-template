export const DataFetchErrorMessage = ({ message }: { message: string }) => {
  return (
    <p className="leading-1 flex h-full flex-col py-10 text-xl font-medium text-muted-foreground">
      {message} Please refresh and try again.
    </p>
  );
};
