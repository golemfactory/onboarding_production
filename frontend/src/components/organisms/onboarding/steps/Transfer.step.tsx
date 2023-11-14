import { NetworkType, TokenCategory, TxStatus } from 'types/ethereum'
import { ThemesManager } from '../../../../themes/ThemesManager'
import { settings } from 'settings'
import { getGLMToken } from 'utils/getGLMToken'
import { getNativeToken } from 'utils/getNativeToken'
import { ChangeEvent, useEffect, useState } from 'react'
import { Slider } from 'components/atoms/slider/slider'
import { formatEther } from 'ethers'
import { useSupplyYagnaWallet } from 'hooks/useSupplyYagnaWallet'
import { CheckmarkIcon } from 'components/atoms/icons'
import { useNetwork } from 'hooks/useNetwork'
import { useBalance } from 'hooks/useBalance'
import { formatBalance } from 'utils/formatBalance'

type Amount = {
  [TokenCategory.GLM]: number
  [TokenCategory.NATIVE]: number
}

const SliderMatic = ({
  amount,
  setAmount,
  balance,
  status,
  chainId,
}: {
  amount: Amount
  setAmount: (newAmount: Amount) => void
  balance: bigint | number
  status: TxStatus
  chainId: NetworkType
}) => {
  const sliderMaticProps = {
    min: settings.minimalBalance[getNativeToken(chainId)],
    step: 0.011,
    max: parseFloat(formatEther(balance || 0n)).toFixed(2),
    label: '',
    value: amount[TokenCategory.NATIVE],
    displayValue: (v: number) => `Transfer ${v} Matic`,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.currentTarget.value)
      setAmount({ ...amount, [TokenCategory.NATIVE]: value })
    },
  }
  return status === TxStatus.READY ? (
    <Slider {...sliderMaticProps} />
  ) : status === TxStatus.PENDING ? (
    <div className="flex">
      <div className="relative flex items-center">
        <div className="animate-spin mr-2 h-6 w-6 rounded-full border-t-4 border-b-4 border-golemblue"></div>
        <div className="ml-2">{`Transferring ${
          amount[TokenCategory.NATIVE]
        } Matic`}</div>
      </div>
    </div>
  ) : (
    <div>
      <div>
        <p className="flex ">
          <CheckmarkIcon className="mr-4" /> Transferred{' '}
          {amount[TokenCategory.NATIVE]} MATIC
        </p>
      </div>
    </div>
  )
}

const SliderGLM = ({
  amount,
  setAmount,
  balance,
  status,
  chainId,
}: {
  amount: Amount
  setAmount: (newAmount: Amount) => void
  balance: bigint | number
  status: TxStatus
  chainId: NetworkType
}) => {
  const sliderMaticProps = {
    min: settings.minimalBalance[getGLMToken(chainId).symbol],
    step: 0.01,
    max: formatBalance(BigInt(balance) || 0n),
    label: '',
    value: amount[TokenCategory.GLM],
    displayValue: (v: number) => `Transfer ${v} GLM`,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.currentTarget.value)
      setAmount({ ...amount, [TokenCategory.GLM]: value })
    },
  }

  return status === TxStatus.READY ? (
    <Slider {...sliderMaticProps} />
  ) : status === TxStatus.PENDING ? (
    <div className="flex mb-4 ">
      <div className="relative flex items-center">
        <div className="animate-spin mr-2 mt-2 h-6 w-6 rounded-full border-t-4 border-b-4 border-golemblue"></div>
        <div className="ml-2">{`Transferring ${
          amount[TokenCategory.GLM]
        } GLM`}</div>
      </div>
    </div>
  ) : (
    <div>
      <div>
        <p className="flex ">
          <CheckmarkIcon className="mr-4" /> Transferred{' '}
          {amount[TokenCategory.GLM]} GLM
        </p>
      </div>
    </div>
  )
}

async function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export const Transfer = ({ goToNextStep }: { goToNextStep: () => void }) => {
  const balance = useBalance()
  const { send, txStatus } = useSupplyYagnaWallet()
  const { chain } = useNetwork()
  if (!chain?.id) {
    throw new Error('Chain not found')
  }
  useEffect(() => {
    if (
      txStatus[TokenCategory.GLM] === TxStatus.SUCCESS &&
      txStatus[TokenCategory.NATIVE] === TxStatus.SUCCESS
    ) {
      sleep(2000).then(() => {
        goToNextStep()
      })
    }
  })

  const [amount, setAmount] = useState<Amount>({
    [TokenCategory.GLM]: settings.minimalBalance[getGLMToken(chain.id).symbol],
    [TokenCategory.NATIVE]: settings.minimalBalance[getNativeToken(chain.id)],
  })

  const StepTemplate = ThemesManager.getInstance()
    .getActiveTheme()
    .getStepTemplate()

  return (
    <StepTemplate
      onConfirm={() => {
        send(amount)
      }}
      title={'Yagna wallet transfer'}
      buttonText={'Transfer'}
      content={
        <>
          <br></br>
          <div>Transfer tokens to your Yagna wallet</div>
          <br></br>
          <SliderGLM
            chainId={chain.id}
            amount={amount}
            setAmount={setAmount}
            balance={balance.GLM}
            status={txStatus[TokenCategory.GLM]}
          />
          <SliderMatic
            chainId={chain.id}
            amount={amount}
            setAmount={setAmount}
            balance={balance.NATIVE}
            status={txStatus[TokenCategory.NATIVE]}
          />
        </>
      }
    />
  )
}
