import styled, { css } from "styled-components"
import { getTypo } from "../../../design/helpers/typo"
import { COLOR } from "../../../design/tokens/color"
import { ETypo } from "../../../design/tokens/typo"

const BaseInput = css`
  padding: 5px 14px;
  background: ${COLOR.INPUT};
  border: 2px solid ${COLOR.PURPLE500};
  color: ${COLOR.PURPLE700};

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  .is-error & {
    border-color: ${COLOR.DANGER} !important;
  }

  &:focus {
    box-shadow: 0 0 0 3px #aad1ff;
    outline: none;
  }
`

export const StyledInputWrapper = styled.div`
  ${BaseInput};
  display: flex;
  align-items: center;
`

export const StyledInput = styled.input`
  ${getTypo(ETypo.FORM_INPUT)};
  line-height: 1.8;
  border: 0;
  background: transparent;
  color: ${COLOR.PURPLE700};
  flex: 1 0 auto;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: ${COLOR.PURPLE500};
  }
`

export const StyledTextarea = styled.textarea`
  ${getTypo(ETypo.FORM_INPUT)};
  ${BaseInput};
  padding: 11px 14px;
  resize: vertical;
  min-height: 200px;

  &::placeholder {
    color: ${COLOR.PURPLE500};
  }
`