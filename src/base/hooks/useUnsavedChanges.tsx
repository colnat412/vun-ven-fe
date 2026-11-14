import { useCallback, useRef } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export default function useUnsavedChanges(dirty: boolean, busy = false) {
  const allowed = useRef(false);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !allowed.current && (dirty || busy) && currentLocation.key !== nextLocation.key,
  );
  useBeforeUnload(
    useCallback(
      (event) => {
        if (!allowed.current && (dirty || busy)) {
          event.preventDefault();
          event.returnValue = '';
        }
      },
      [dirty, busy],
    ),
  );
  return {
    allowNavigation: () => {
      allowed.current = true;
      if (blocker.state === 'blocked') blocker.reset();
    },
    confirmation:
      blocker.state === 'blocked' ? (
        <Modal
          title={busy ? 'Đang lưu thay đổi' : 'Bỏ thay đổi chưa lưu?'}
          onClose={() => blocker.reset()}
          description={
            busy
              ? 'Vui lòng đợi lưu xong trước khi rời màn hình.'
              : 'Các thay đổi trên màn hình này sẽ không được lưu.'
          }
        >
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => blocker.reset()}>
              Tiếp tục chỉnh sửa
            </Button>
            {!busy && <Button onClick={() => blocker.proceed()}>Bỏ thay đổi</Button>}
          </div>
        </Modal>
      ) : null,
  };
}
