--TEST PR 
  --AUTO BUY STUFF
  _G.autoGold = false --change to true for buying GoldPotion
  _G.autoLuck = false --change to true for buying luckPotion
  _G.autoDama = false --change to true for buying damage potion
  _G.autoXppo = false --change to true for buying xp potions
  
  --autodrink stuff
  _G.autodrinkluck = false --change to true for it to auto autodrink luck
  _G.autodrinkgold = false --change to true to auto drink gold potion
  _G.autodrinkdama = false --change to true to autodrink dama potions
  _G.autodrinkxppo = false --change to truwe to autodrink xp potion
  
  --trade spam
  _G.autotrade = false --change to true to spam
  
  
  --autochest stuff
  _G.autochest = false      --change to true for chest to open
  _G.autochestclicker = false --change to true for it to work
  
  
  
  --tp stuff
  _G.tp = false  --change to true to tp
  _G.heven = false --change to true to tp
  
  
  
  
  --annoying shit
  _G.annoy = false --change to true to annoy jameson
  
  
  local OrionLib = loadstring(game:HttpGet(('https: //raw.githubusercontent.com/shlexware/Orion/main/source')))()
  local Window = OrionLib:MakeWindow({ Name = 'Pet Rift Potions', HidePremium = true, IntroText = 'Pet Rift Potions',
      IntroIcon = 'rbxassetid: //10414911576' })
  local tab = {}
  tab.buy = Window:MakeTab({
      Name = 'Purchase',
      Icon = 'rbxassetid: //7939405279',
      PremiumOnly = false
                })
  
  tab.drink = Window:MakeTab({
      Name = 'Drink',
      Icon = 'rbxassetid: //6493470706',
      PremiumOnly = false
                })
  
  tab.misc = Window:MakeTab({
      Name = 'Misc',
      Icon = 'rbxassetid: //7059346373',
      PremiumOnly = false
                })
  
  tab.Tools = Window:MakeTab({
      Name = 'Tools',
      Icon = 'rbxassetid: //7059446373',
      PremiumOnly = false
                })
  
  tab.AutoFarm = Window:MakeTab({
      Name = 'Autofarm',
      Icon = 'rbxassetid: //6493470706',
      PremiumOnly = false
                })
  
  tab.annoy = Window:MakeTab({
      Name = 'annoy',
      Icon = 'rbxassetid: //7059346373',
      PremiumOnly = false
                })
  
  tab.Trade = Window:MakeTab({
      Name = 'Trade',
      Icon = 'rbxassetid: //7059346373',
      PremiumOnly = false
                })
  
  tab.Chest = Window:MakeTab({
      Name = 'Chest',
      Icon = 'rbxassetid: //7059346373',
      PremiumOnly = false
                })
  
  tab.Teloport = Window:MakeTab({
      Name = 'Teloport ',
      Icon = 'rbxassetid: //6493470706',
      PremiumOnly = false
                })
  
  tab.credits = Window:MakeTab({
      Name = 'Credits',
      Icon = 'rbxassetid: //8733216068',
      PremiumOnly = false
                })
  
  tab.buy:AddToggle({
      Name = 'Auto Gold',
      Default = false,
      Callback = function(Value)
          _G.autoGold = Value
          while _G.autoGold and wait() do
              local args = {
                        [
                            1
                        ] = 'MerchantBuy',
                        [
                            2
                        ] = 'GoldPotion'
                    }
              game:GetService('ReplicatedStorage'):WaitForChild('Remotes'):WaitForChild('Client'):FireServer(unpack(args))
          end
      end
                })
  
  tab.buy:AddToggle({
      Name = 'Auto Luck',
      Default = false,
      Callback = function(Value)
          _G.autoLuck = Value
          while _G.autoLuck and wait() do
              local args = {
                        [
                            1
                        ] = 'MerchantBuy',
                        [
                            2
                        ] = 'LuckPotion'
                    }
  
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  tab.buy:AddToggle({
      Name = 'Auto XP',
      Default = false,
      Callback = function(Value)
          _G.autoXppo = Value
          while _G.autoXppo and wait() do
              local args = {
                        [
                            1
                        ] = 'MerchantBuy',
                        [
                            2
                        ] = 'XPPotion'
                    }
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  tab.buy:AddToggle({
      Name = 'Auto Damage',
      Default = false,
      Callback = function(Value)
          _G.autoDama = Value
          while _G.autoDama and wait() do
              local args = {
                        [
                            1
                        ] = 'MerchantBuy',
                        [
                            2
                        ] = 'DamagePotion'
                    }
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  tab.drink:AddToggle({
      Name = 'Auto Gold',
      Default = false,
      Callback = function(Value)
          _G.autodrinkgold = Value
          while _G.autodrinkgold and wait() do
              local args = {
                        [
                            1
                        ] = 'Potion',
                        [
                            2
                        ] = 'GOLD'
                    }
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  tab.drink:AddToggle({
      Name = 'Auto Luck',
      Default = false,
      Callback = function(Value)
          _G.autodrinkluck = Value
          while _G.autodrinkluck and wait() do
              local args = {
                        [
                            1
                        ] = 'Potion',
                        [
                            2
                        ] = 'LUCK'
                    }
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  tab.drink:AddToggle({
      Name = 'Auto XP',
      Default = false,
      Callback = function(Value)
          _G.autodrinkxppo = Value
          while _G.autodrinkxppo and wait() do
              local args = {
                        [
                            1
                        ] = 'Potion',
                        [
                            2
                        ] = 'XP'
                    }
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  
  tab.drink:AddToggle({
      Name = 'Auto Damage',
      Default = false,
      Callback = function(Value)
          _G.autodrinkdama = Value
          while _G.autodrinkdama and wait() do
              local args = {
                        [
                            1
                        ] = 'Potion',
                        [
                            2
                        ] = 'DAMAGE'
                    }
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  
  tab.misc:AddSlider({
      Name = 'Walk Speed',
      Min = 16,
      Max = 500,
      Default = 16,
      Color = Color3.fromRGB(255,
                    255,
                    255),
      Increment = 1,
      ValueName = '',
      Callback = function(Value)
          game:GetService('Players').LocalPlayer.Character.Humanoid.WalkSpeed = Value
      end
                })
  tab.Trade:AddToggle({
      Name = 'auto trade spam',
      Default = false,
      Callback = function(Value)
          _G.autotrade = Value
          while _G.autotrade and wait() do
              local args = {
                        [
                            1
                        ] = 'SentTrade',
                        [
                            2
                        ] = 'CleanDoesRoblox'
                    }
  
              game:GetService('ReplicatedStorage'):WaitForChild('Remotes'):WaitForChild('Trade'):FireServer(unpack(args))
          end
      end
                })
  
  tab.Chest:AddToggle({
      Name = 'Chestopener',
      Default = false,
      Callback = function(Value)
          _G.autochest = Value
          while _G.autochest and wait() do
              local args = {
                        [
                            1
                        ] = 'OpenGift_One',
                        [
                            2
                        ] = 'vmSHHJisBJhp_1623598096_1681837200',
                        [
                            3
                        ] = 'Normal'
                    }
  
              game:GetService('ReplicatedStorage'):WaitForChild('Remotes'):WaitForChild('Client'):FireServer(unpack(args))
          end
      end
                })
  
  tab.Chest:AddToggle({
      Name = 'autochestclicker',
      Default = false,
      Callback = function(Value)
          _G.autochestclicker = Value
          while _G.autochestclicker and wait() do
              local args = {
                        [
                            1
                        ] = 'OpenningEgg_Open',
                        [
                            2
                        ] = 'BNFeridgznJZ_1623598096_1681925912'
                    }
  
              game:GetService('ReplicatedStorage'):WaitForChild('Remotes'):WaitForChild('Client'):FireServer(unpack(args))
          end
      end
                })
  
  tab.Teloport:AddToggle({
      Name = 'Teloport',
      Default = false,
      Callback = function(Value)
          _G.tp = Value
          while _G.tp and wait() do
              local args = {
                        [
                            1
                        ] = 'Teleport',
                        [
                            2
                        ] = 'Vampire Castle'
                    }
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  tab.Teloport:AddToggle({
      Name = 'Heven',
      Default = false,
      Callback = function(Value)
          _G.heven = Value
          while _G.heven and wait() do
              local args = {
                        [
                            1
                        ] = 'Teleport',
                        [
                            2
                        ] = 'Heaven'
                    }
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
          end
      end
                })
  
  tab.annoy:AddToggle({
      Name = 'annoy',
      Default = false,
      Callback = function(Value)
          _G.annoy = Value
          while _G.annoy and wait() do
              local args = {
                        [
                            1
                        ] = 'jameson is annoying',
                        [
                            2
                        ] = 'All'
                    }
              game:GetService('ReplicatedStorage').DefaultChatSystemChatEvents.SayMessageRequest:FireServer(unpack(args))
          end
      end
                })
  
  tab.Teloport:AddButton({
      Name = 'Heaven',
      Callback = function()
          local args = {
                        [
                            1
                        ] = 'Teleport',
                        [
                            2
                        ] = 'Heaven'
                    }
          game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
      end
                })
  
  tab.Tools:AddButton({
      Name = 'equipBest',
      Callback = function()
          local args = {
                        [
                            1
                        ] = 'Equip Best'
                    }
  
          game:GetService('ReplicatedStorage').Remotes.PetActionRequest:InvokeServer(unpack(args))
      end
                })
  tab.Teloport:AddButton({
      Name = 'Spawn',
      Callback = function()
          local args = {
                        [
                            1
                        ] = 'Teleport',
                        [
                            2
                        ] = 'Spawn'
                    }
  
          game:GetService('ReplicatedStorage').Remotes.Client:FireServer(unpack(args))
      end
                })
  
  tab.AutoFarm:AddSection({
      Name = 'Auto Attack Piles'
                })
  
  local Loop_AutoFarm = false
  
  local function GetPlayerWorlds()
      local arr = { 'Spawn'
                }
  
      for i, v in pairs(game:GetService('Players').LocalPlayer.World:GetChildren()) do
          table.insert(arr, v.Name)
      end
  
      return arr
  end
  
  local function AutoFarmStart()
      if Loop_AutoFarm == true then
          local zone = OrionLib.Flags['AutoFarm_AreaDD'
                ].Value
  
          zone = string.gsub(string.gsub(string.gsub(string.upper(zone), ' ', '_'), 'ARCH', 'ARCH_ZONE_1'), 'HEAVEN',
              'HEAVEN1')
          local newPos = CFrame.new(game:GetService('Workspace').ObjectsFolder[zone
                ].CFrame.x,
              game:GetService('Workspace').ObjectsFolder[zone
                ].CFrame.y + 3,
              game:GetService('Workspace').ObjectsFolder[zone
                ].CFrame.z)
          game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = newPos
  
          for i, v in pairs(game:GetService('Workspace').PlayerPets:FindFirstChild(game:GetService('Players').LocalPlayer.Name):GetChildren()) do
              for _, c in pairs(v:GetChildren()) do
                  if pcall(function() local check = c.CFrame end) then
                      c.CFrame = game.Players.LocalPlayer.Character.Head.CFrame
                  end
              end
          end
  
          wait(0.5)
  
          while (Loop_AutoFarm == true) do
              local pile = workspace.ObjectsFolder[zone
                ]:GetChildren()[
                    1
                ]
  
              game:GetService('ReplicatedStorage').Remotes.Client:FireServer('AllPetsAttack', pile)
  
              repeat wait(.001) until workspace.ObjectsFolder[zone
                ]:GetChildren()[
                    1
                ] ~= pile
          end
      end
  end
  
  tab.AutoFarm:AddDropdown({
      Name = 'Area',
      Default = 'Spawn',
      Options = GetPlayerWorlds(),
      Flag = 'AutoFarm_AreaDD',
      Callback = function()
          AutoFarmStart()
      end
                })
  
  tab.AutoFarm:AddToggle({
      Name = 'Farm Piles',
      Default = false,
      Flag = 'AutoFarm_AreaTGL',
      Callback = function(Value)
          Loop_AutoFarm = Value
          OrionLib.Flags['AutoFarm_AreaDD'
                    ]:Refresh(GetPlayerWorlds(), true)
  
          AutoFarmStart()
      end
                })
  
  tab.credits:AddLabel('GUI Made By: SippingSizzurp')
  tab.credits:AddLabel('Scripts Made By: Poke01')
  tab.credits:AddLabel('teleport buttons added by Piuro and poke01 ')
  
  OrionLib:Init()
