import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/settings/profile",
      permanent: false,
    },
  };
};

export default function SettingsPage() {
  return <></>;
}
