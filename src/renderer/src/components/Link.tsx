import React from 'react';

type LinkProps = {
  children: React.ReactNode;
  href: string;
};
function Link({ href, children }: LinkProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

type ButtonProps = {
  children: React.ReactNode;
};
type ButtonPropsExtend = LinkProps & ButtonProps;

function Button({ href, children }: ButtonPropsExtend) {
  return (
    <Link href={href}>
      <button type="button">{children}</button>
    </Link>
  );
}

Link.Button = Button;
export default Link;
