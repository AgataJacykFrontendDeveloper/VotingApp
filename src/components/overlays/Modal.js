import "./Modal.css";

const Modal = ({ title, body, close, buttons }) => {
  return (
    <>
      <div
        className="modal-overlay-bp1hFrx position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center"
        onClick={close}
      ></div>
      <div className="modal-wrapper-bp1hFrx position-fixed start-50 top-50 translate-middle d-flex justify-content-center">
        <div className="modal-content-bp1hFrx rounded-5 gap-1 d-flex flex-column justify-content-between align-items-center">
          <button
            className="modal-close-bp1hFrx border-0 p-0 bg-transparent align-self-end"
            onClick={close}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>

          {title && <h4 className="modal-title-bp1hFrx mb-3">{title}</h4>}
          {body && (
            <p className="modal-body-bp1hFrx text-center mb-3">{body}</p>
          )}
          <div className="d-flex justify-content-evenly w-100">
            {buttons &&
              buttons.map((button, index) => (
                <button
                  key={index}
                  className={`modal-button-bp1hFrx modal-button-${button.type || "success"}`}
                  onClick={button.action}
                >
                  {button.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
