// components/welcome/intro.tsx
import { motion } from 'framer-motion'
import { MouseEventHandler } from 'react'
import { getGLMToken } from 'utils/getGLMToken'

const variants = {
  show: { opacity: 1 },
  hidden: { opacity: 0 },
}
const AddGLMPresentational = ({ onConfirm }: { onConfirm: MouseEventHandler }) => {
  return (
    <div className="text-center">
      <motion.h1 className="text-4xl font-bold mb-4 text-white" variants={variants}>
        Add GLM token to wallet
      </motion.h1>
      <motion.p className="max-w-md text-white my-4 text-xl" variants={variants}>
        We need to be sure you track your GLM balance in your wallet
      </motion.p>
      <motion.button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        variants={variants}
        onClick={(e) => {
          onConfirm(e)
        }}
      >
        Add GLM
      </motion.button>
    </div>
  )
}

export const AddGLM = ({ goToNextStep }: { goToNextStep: () => {} }) => {
  const addGLM = async () => {
    const { address, decimals, symbol } = await getGLMToken()

    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: { type: 'ERC20', options: { address, decimals, symbol } },
    })

    goToNextStep()
  }

  return <AddGLMPresentational onConfirm={addGLM} />
}
