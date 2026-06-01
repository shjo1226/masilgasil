"use client";

import { MouseEvent, useCallback } from "react";

import { Button } from "@/components";
import { useUI } from "@/components/uiContext/UiContext";
import useAuthStore from "@/lib/stores/useAuthStore";

import { useRouter } from "next/navigation";

const LogStartButton = () => {
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
        textColor="#FFFFFF"
        buttonColor="#A4D24D"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "9rem",
          maxWidth: "56rem",
          transform: "translateX(-50%)",
          fontSize: "1.6rem",
          fontWeight: "700",
        }}
        onClickHandler={handleClick}
      >
        산책하러가기
      </Button>
    </>
  );
};

export default LogStartButton;
