"use client";

import { Button } from "@/components";
import { useUI } from "@/components/uiContext/UiContext";
import useAuthStore from "@/lib/stores/useAuthStore";

import { PostTabType } from "../../Post.types";

import { MouseEvent } from "react";
import Link from "next/link";

interface PostLinkButtonProps {
  tabIndex: PostTabType;
  postId: string;
  firstLat: number;
  firstLng: number;
}

const PostLinkButton = ({ tabIndex, postId, firstLat, firstLng }: PostLinkButtonProps) => {
  const { isLogIn } = useAuthStore();

  const { openModal, setModalView } = useUI();

  const handleClickButton = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isLogIn) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setModalView("ACCESS_LOGIN_VIEW");
    openModal();
  };

  return (
    <Link
      href={
        tabIndex === PostTabType.Mate
          ? `/mate/create?postId=${postId}&lat=${firstLat}&lng=${firstLng}`
          : `/log/record?postId=${postId}`
      }
      onClick={handleClickButton}
    >
      <Button
        width="calc(100% - 4rem)"
        textColor="#FFFFFF"
        buttonColor="#81BB26"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "9rem",
          transform: "translateX(-50%)",
          fontSize: "1.6rem",
          fontWeight: "700",
        }}
      >
        {tabIndex === PostTabType.Mate ? "메이트 모집하기" : "현재 경로로 산책하기"}
      </Button>
    </Link>
  );
};

export default PostLinkButton;
