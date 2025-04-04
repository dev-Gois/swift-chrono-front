import { OrbitProgress } from 'react-loading-indicators';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <OrbitProgress
        variant="track-disc"
        dense
        color="#000000"
        size="large"
        text=""
        textColor="#000000"
      />
    </div>
  )
}
