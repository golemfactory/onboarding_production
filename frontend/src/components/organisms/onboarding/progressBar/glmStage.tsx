import { ProgressStage } from 'components/molecules'
import { formatEther } from 'ethers'
import { useMetaMask } from 'hooks/useMetamask'
import { OnboardingStage, OnboardingStageType } from 'state/stages'
import { GolemIcon } from 'components/atoms/icons'
export const GLMStage = ({ stage }: { stage: OnboardingStageType }) => {
  const isCompleted = stage > OnboardingStage.GLM
  const isCurrent = stage === OnboardingStage.GLM
  const { wallet } = useMetaMask()

  const uncompletedMessage = 'Network utility token'
  const completedMessage = `Current balance: ${parseFloat(
    formatEther(wallet.balance.GLM.toString())
  ).toFixed(2)}`
  return (
    <ProgressStage
      title="GLM"
      message={isCompleted ? completedMessage : uncompletedMessage}
      isCompleted={isCompleted}
      isCurrent={isCurrent}
      index={<GolemIcon />}
    />
  )
}
