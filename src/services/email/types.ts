export type EmailProps<V> = {
  from: string;
  to: string;
  subject: string;
  data: V;
  template: React.FC<V>;
};
