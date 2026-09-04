export default function Button({
  children,
  variant = 'primary',
  size,
  className = '',
  type = 'button',
  ...rest
}) {
  const classes = [
    'button',
    `button--${variant}`,
    size ? `button--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
