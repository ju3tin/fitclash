"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card1"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Award, Star, Zap, Crown, Gift } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

interface NFTReward {
  id: string
  name: string
  description: string
  requirement: number
  icon: React.ReactNode
  rarity: "common" | "rare" | "epic" | "legendary"
  earned: boolean
}

interface NFTRewardsProps {
  achievements: string[]
  userScore: number
}

export function NFTRewards({ achievements, userScore }: NFTRewardsProps) {
  const { connected, publicKey } = useWallet()
  const [isMinting, setIsMinting] = useState<string | null>(null)

  const nftRewards: NFTReward[] = [
    {
      id: "bronze",
      name: "Bronze Warrior",
      description: "Complete your first 1,000 fitness points",
      requirement: 1000,
      icon: <Award className="h-8 w-8 text-amber-600" />,
      rarity: "common",
      earned: achievements.includes("bronze"),
    },
    {
      id: "silver",
      name: "Silver Champion",
      description: "Reach 5,000 fitness points",
      requirement: 5000,
      icon: <Star className="h-8 w-8 text-gray-400" />,
      rarity: "rare",
      earned: achievements.includes("silver"),
    },
    {
      id: "gold",
      name: "Gold Legend",
      description: "Achieve 10,000 fitness points",
      requirement: 10000,
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      rarity: "epic",
      earned: achievements.includes("gold"),
    },
    {
      id: "diamond",
      name: "Diamond Elite",
      description: "Master level: 25,000 fitness points",
      requirement: 25000,
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      rarity: "legendary",
      earned: userScore >= 25000,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const handleMintNFT = async (nftId: string) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first")
      return
    }

    setIsMinting(nftId)

    try {
      // Simulate NFT minting process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would:
      // 1. Call your Solana program to mint the NFT
      // 2. Upload metadata to IPFS/Arweave
      // 3. Create the NFT with proper attributes

      alert(`Successfully minted ${nftRewards.find((nft) => nft.id === nftId)?.name} NFT!`)
    } catch (error) {
      console.error("Minting failed:", error)
      alert("Failed to mint NFT. Please try again.")
    } finally {
      setIsMinting(null)
    }
  }

  if (!connected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Gift className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="text-lg font-semibold">Connect Wallet for NFT Rewards</h3>
            <p className="text-gray-600">Connect your Solana wallet to mint exclusive fitness achievement NFTs!</p>
            <WalletMultiButton />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Current Score</span>
              <span className="font-bold">{userScore.toLocaleString()} points</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Next Milestone</span>
                <span>
                  {userScore >= 25000
                    ? "All milestones completed!"
                    : `${Math.max(1000, 5000, 10000, 25000) - userScore} points to go`}
                </span>
              </div>
              <Progress value={Math.min(100, (userScore / 25000) * 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nftRewards.map((nft) => (
          <Card key={nft.id} className={`relative ${nft.earned ? "ring-2 ring-green-500" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {nft.icon}
                  <div>
                    <CardTitle className="text-lg">{nft.name}</CardTitle>
                    <Badge variant="outline" className={`mt-1 ${getRarityColor(nft.rarity)}`}>
                      {nft.rarity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {nft.earned && (
                  <Badge variant="default" className="bg-green-500">
                    ✓ Earned
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{nft.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Requirement</span>
                  <span className="font-medium">{nft.requirement.toLocaleString()} points</span>
                </div>
                <Progress value={Math.min(100, (userScore / nft.requirement) * 100)} className="h-2" />
                <div className="text-xs text-gray-500">
                  {userScore >= nft.requirement ? "Requirement met!" : `${nft.requirement - userScore} points needed`}
                </div>
              </div>

              <Button
                onClick={() => handleMintNFT(nft.id)}
                disabled={!nft.earned || isMinting === nft.id}
                className="w-full"
                variant={nft.earned ? "default" : "outline"}
              >
                {isMinting === nft.id ? "Minting..." : nft.earned ? "Mint NFT" : "Not Available"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your NFT Collection</CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => {
                const nft = nftRewards.find((n) => n.id === achievement)
                return nft ? (
                  <div key={achievement} className="text-center p-4 border rounded-lg">
                    {nft.icon}
                    <div className="mt-2 text-sm font-medium">{nft.name}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Owned
                    </Badge>
                  </div>
                ) : null
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No NFTs earned yet. Start working out to earn your first achievement!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
