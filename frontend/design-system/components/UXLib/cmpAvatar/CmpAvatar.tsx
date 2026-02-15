"use client";
import React, { useState } from 'react'
import { CmpSvg } from '../cmpSvg/CmpSvg';
import { CmpButton } from '../cmpButton/CmpButton';
import { CmpListSvg } from '../cmpListSvg/CmpListSvg';
import { Modal } from '../Modal/Modal';

interface CmpAvatarProps {
  id?: string;
  backForm?: string;
  size?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  alt?: string;
  src?: string;
  name?: string;
  avatarClr?: string;
  avatarSizeList?: string;
  onClickAvatar?: (e: React.MouseEvent<HTMLElement>) => void;
  onChange?: (e: string) => void;
}

const CmpAvatar: React.FC<CmpAvatarProps> = ({
  id,
  avatarClr = 'var(--primary-color)',
  size = '111px',
  avatarSizeList = '32px',
  onClickAvatar = () => { },
  onChange = () => { },
}) => {
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('')

  const setnameAvatar = (nameAvatar: string) => {
    setTempAvatar(nameAvatar);
  }

  const onSubmit = () => {
    setAvatar(tempAvatar);
    onChange(tempAvatar);
    setShowModal(false);
  }

  return (
    <div className='container-list-avatar' id={id}>
      <div className={"avatar-icon"} style={avatar === '' ? { background: "#cacaca", width: size, height: size, borderRadius: "50%" } : {}}  >

        <CmpSvg
          icon={avatar}
          fontSize={size}
          //  color="#d57611" 
          onClick={onClickAvatar}
          title={avatar}
        />
      </div>
      <div className="avatar-name">{avatar}</div>
      <div className="list-avatar">
        <CmpButton
          iconPosition='right'
          icon='search'
          nameBtn='List Avatars'
          onClick={() => setShowModal(true)} />
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Iconos"
          onConfirm={onSubmit}
          confirmText="Enviar"
          onCancel={() => setShowModal(false)}
          cancelText="Cancelar"
          closeOnOverlayClick={true}
          className="modal-filter-crud"
          style={{ width: "88%", backgroundColor: "#FFF" }}
        >
          {<CmpListSvg nameSvg={setnameAvatar} svgDefault={avatar} />}
        </Modal>
      </div>
    </div>
  )
}

export { CmpAvatar }