import React from "react";
import useStyle from "./Hooks/UseStyle";

const Modal = ({ title, onClose, children, wide, formId, submitDisabled = false, submitLabel = "Salvar" }) => {
  const { S } = useStyle();

  return (
    <div style={S.overlay} onClick={onClose}>
      <div
        style={{ ...S.modal, maxWidth: wide ? 980 : 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={S.modalHead}>
          <h2 style={S.modalTitle}>{title}</h2>
          <button style={S.closeBtn} onClick={onClose}>
            {"\u2715"}
          </button>
        </div>
        <div style={S.modalBody}>{children}</div>
        <div
          style={S.footerModal}
        >
          <button style={S.btnOutline} onClick={onClose} disabled={submitDisabled}>
            Cancelar
          </button>
          <button style={S.btnPrimary} type="submit" form={formId} disabled={submitDisabled}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
