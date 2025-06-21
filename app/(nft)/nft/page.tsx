"use client"

import { useState } from "react"
import { WalletProvider } from "../../../components/wallet-provider"
import { FitnessTracker } from "../../../components/fitness-tracker"
import { Scoreboard } from "../../../components/scoreboard"
import { NFTRewards } from "../../../components/nft-rewards"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card1"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Activity, Trophy, Award } from "lucide-react"

export default function FitnessApp() {
  const [userScore, setUserScore] = useState(0)
  const [exerciseCount, setExerciseCount] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])

  const handleScoreUpdate = (newScore: number, exercises: number) => {
    setUserScore((prev) => prev + newScore)
    setExerciseCount((prev) => prev + exercises)

    // Check for achievements
    if (userScore + newScore >= 1000 && !achievements.includes("bronze")) {
      setAchievements((prev) => [...prev, "bronze"])
    }
    if (userScore + newScore >= 5000 && !achievements.includes("silver")) {
      setAchievements((prev) => [...prev, "silver"])
    }
    if (userScore + newScore >= 10000 && !achievements.includes("gold")) {
      setAchievements((prev) => [...prev, "gold"])
    }
  }

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">FitClash</h1>
            <p className="text-lg text-gray-600">Solana-Powered Fitness Tracking with AI Pose Detection</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userScore.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exercises</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{exerciseCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{achievements.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NFTs Earned</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{achievements.length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="rewards">NFT Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="workout" className="space-y-4">
              <FitnessTracker onScoreUpdate={handleScoreUpdate} />
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              <Scoreboard currentUserScore={userScore} />
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <NFTRewards achievements={achievements} userScore={userScore} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </WalletProvider>
  )
}
