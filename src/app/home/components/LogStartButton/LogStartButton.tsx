"use client";

import { MouseEvent, useCallback } from "react";

import tailwindConfig from "@/../tailwind.config";
import { Button } from "@/components";
import { useUI } from "@/components/uiContext/UiContext";
import useAuthStore from "@/lib/stores/useAuthStore";

import { useRouter } from "next/navigation";
import resolveConfig from "tailwindcss/resolveConfig";

const LogStartButton = () => {
  const { theme } = resolveConfig(tailwindConfig);

  const { isLogIn } = useAuthStore();
  const navigate = useRouter();

  const { openModal, setModalView } = useUI();

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLogIn) {
      navigate.push("/log/record");
      return;
    }

    setModalView("ACCESS_LOGIN_VIEW");
    openModal();
    return;
  }, [isLogIn, navigate, openModal, setModalView]);

  return (
    <>
      <Button
        width="100%"
        textColor={theme.colors.white}
        buttonColor={theme.colors.green_400}
        style={{
          position: "fixed",
          left: "50%",
          bottom: "9rem",
          maxWidth: "56rem",
          transform: "translateX(-50%)",
          fontSize: `${theme.fontSize.large}`,
          fontWeight: `${theme.fontWeight.bold}`,
        }}
        onClickHandler={handleClick}
      >
        산책하러가기
      </Button>
    </>
  );
};

export default LogStartButton;
