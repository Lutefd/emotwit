import { type AppType } from "next/app";

import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ptBR } from "@clerk/localizations";

const localization = {
  ...ptBR,
  signIn: {
    start: {
      title: "Olá!",
      subtitle: "Entre com seu melhor SSO para continuar",
      actionText: "Não tem uma conta?",
      actionLink: "Crie uma!",
    },
  },
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider localization={localization} {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
