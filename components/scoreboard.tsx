"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card1"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

interface LeaderboardEntry {
  rank: number
  wallet: string
  score: number
  exercises: number
  nfts: number
}

interface ScoreboardProps {
  currentUserScore: number
}

export function Scoreboard({ currentUserScore }: ScoreboardProps) {
  const { publicKey, connected } = useWallet()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    // Mock leaderboard data - in a real app, this would come from Solana program
    const mockData: LeaderboardEntry[] = [
      { rank: 1, wallet: "FitMaster...xyz", score: 25000, exercises: 150, nfts: 5 },
      { rank: 2, wallet: "GymHero...abc", score: 22000, exercises: 130, nfts: 4 },
      { rank: 3, wallet: "FlexKing...def", score: 19500, exercises: 120, nfts: 3 },
      { rank: 4, wallet: "IronWill...ghi", score: 18000, exercises: 110, nfts: 3 },
      { rank: 5, wallet: "FitQueen...jkl", score: 16500, exercises: 100, nfts: 2 },
      { rank: 6, wallet: "MuscleMax...mno", score: 15000, exercises: 95, nfts: 2 },
      { rank: 7, wallet: "PowerLift...pqr", score: 13500, exercises: 85, nfts: 1 },
      { rank: 8, wallet: "CardioKing...stu", score: 12000, exercises: 80, nfts: 1 },
    ]

    // Add current user if connected
    if (connected && publicKey && currentUserScore > 0) {
      const userWallet = publicKey.toString().slice(0, 8) + "..." + publicKey.toString().slice(-3)
      const userEntry: LeaderboardEntry = {
        rank: 0,
        wallet: userWallet,
        score: currentUserScore,
        exercises: Math.floor(currentUserScore / 100),
        nfts: Math.floor(currentUserScore / 5000),
      }

      // Find user's rank
      const rank = mockData.filter((entry) => entry.score > currentUserScore).length + 1
      userEntry.rank = rank
      setUserRank(rank)

      // Insert user into leaderboard
      const updatedLeaderboard = [...mockData, userEntry]
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, 10)

      setLeaderboard(updatedLeaderboard)
    } else {
      setLeaderboard(mockData)
    }
  }, [connected, publicKey, currentUserScore])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const isCurrentUser = (wallet: string) => {
    if (!connected || !publicKey) return false
    const userWallet = publicKey.toString().slice(0, 8) + "..." + publicKey.toString().slice(-3)
    return wallet === userWallet
  }

  return (
    <div className="space-y-6">
      {!connected && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
              <p className="text-gray-600">Connect your Solana wallet to join the leaderboard and earn NFT rewards!</p>
              <WalletMultiButton />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connected && userRank ? `#${userRank}` : "--"}</div>
            <p className="text-xs text-muted-foreground">
              {connected ? "Global ranking" : "Connect wallet to see rank"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUserScore.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total fitness points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard[0]?.score.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">Current leader</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.wallet}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isCurrentUser(entry.wallet) ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">{getRankIcon(entry.rank)}</div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{entry.wallet.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {entry.wallet}
                      {isCurrentUser(entry.wallet) && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.exercises} exercises • {entry.nfts} NFTs
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{entry.score.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
