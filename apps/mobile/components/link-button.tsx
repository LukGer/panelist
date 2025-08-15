import { Href, useRouter } from "expo-router";
import Button, { ButtonProps } from "./button";

interface LinkButtonProps extends ButtonProps {
  href: Href;
}

const LinkButton = (props: LinkButtonProps) => {
  const router = useRouter();

  return <Button {...props} onPress={() => router.navigate(props.href)} />;
};

export default LinkButton;
