interface NotFoundPageProps {
  className?: string;
}

export default function NotFoundPage(props: NotFoundPageProps) {
  const {className = '', ...otherProps} = props;

  return (
    <div className={`${className}`} {...otherProps}>
      <h1>NotFoundPage</h1>
    </div>
  );
}
