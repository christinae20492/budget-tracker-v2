import React, { useEffect } from 'react'

interface ConfirmModalProps {
    dialogue: string,
    renderInput?: () => React.ReactNode,
    buttonOne: string,
    buttonTwo: string,
    buttonThree?: string,
    buttonOneAction: () => void,
    buttonTwoAction: () => void,
    buttonThreeAction?: () => void,
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ dialogue, renderInput, buttonOne, buttonTwo, buttonThree, buttonOneAction, buttonTwoAction, buttonThreeAction }) => {

  return (
    <div className='modal-bg'>
            <div className='modal-main h-fit border border-grey-500'>
                <p>{dialogue}</p>
                {renderInput && (
                    <div>
                    {renderInput()}
                    </div>
                )}
                <div className='flex grow w-full flex-row justify-evenly content-between'>
                <button className='button m-3 bg-notindigo-250 hover:bg-notindigo-300 text-white' onClick={buttonOneAction}>
                    {buttonOne}
                </button>
                <button className='button m-3 bg-gray-800 hover:bg-gray-600 text-white' onClick={buttonTwoAction}>
                    {buttonTwo}
                </button>
                {buttonThree && (
                <button className='button m-3 bg-blue-dusk' onClick={buttonThreeAction}>
                    {buttonThree}
                </button>
                )}
                </div>
        </div>
    </div>
  )
}
