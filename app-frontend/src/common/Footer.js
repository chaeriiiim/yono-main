import React from "react";
import styled from "styled-components";

export function Footer() {
  const FooterStyle = styled.footer`
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: "20px 0";
    background-color: #f8f9fa;
    text-align: center;
  `;

  return (
    <FooterStyle>
      <h1>임의 푸터</h1>
      <p>© 2024 Mickle Muckle. All rights reserved.</p>
    </FooterStyle>
  );
}
