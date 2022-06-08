export interface AICombatRoles {
  id: number;
  preferredRole: number;
  specifiedMinRangeNOUSE: number;
  specifiedMaxRangeNOUSE: number;
  specificMinRange: number;
  specificMaxRange: number;
}

export interface AccessoryDefaultLoc {
  GroupID: number;
  Description: string;
  PosX: number;
  PosY: number;
  PosZ: number;
  RotX: number;
  RotY: number;
  RotZ: number;
}

export interface Activities {
  ActivityID: number;
  locStatus: number;
  instanceMapID: number;
  minTeams: number;
  maxTeams: number;
  minTeamSize: number;
  maxTeamSize: number;
  waitTime: number;
  startDelay: number;
  requiresUniqueData: boolean;
  leaderboardType: number;
  localize: boolean;
  optionalCostLOT: number;
  optionalCostCount: number;
  showUIRewards: boolean;
  CommunityActivityFlagID: number;
  gateVersion: string;
  noTeamLootOnDeath: boolean;
  optionalPercentage: number;
}

export interface ActivityRewards {
  objectTemplate: number;
  ActivityRewardIndex: number;
  activityRating: number;
  LootMatrixIndex: number;
  CurrencyIndex: number;
  ChallengeRating: number;
  description: string;
}

export interface ActivityText {
  activityID: number;
  type: string;
  localize: boolean;
  locStatus: number;
  gateVersion: string;
}

export interface AnimationIndex {
  animationGroupID: number;
  description: string;
  groupType: string;
}

export interface Animations {
  animationGroupID: number;
  animationType: string;
  animationName: string;
  chanceToPlay: number;
  minLoops: number;
  maxLoops: number;
  animationLength: number;
  hideEquip: boolean;
  ignoreUpperBody: boolean;
  restartable: boolean;
  faceAnimationName: string;
  priority: number;
  blendTime: number;
}

export interface BaseCombatAIComponent {
  id: number;
  behaviorType: number;
  combatRoundLength: number;
  combatRole: number;
  minRoundLength: number;
  maxRoundLength: number;
  tetherSpeed: number;
  pursuitSpeed: number;
  combatStartDelay: number;
  softTetherRadius: number;
  hardTetherRadius: number;
  spawnTimer: number;
  tetherEffectID: number;
  ignoreMediator: boolean;
  aggroRadius: number;
  ignoreStatReset: boolean;
  ignoreParent: boolean;
}

export interface BehaviorEffect {
  effectID: number;
  effectType: string;
  effectName: string;
  trailID: number;
  pcreateDuration: number;
  animationName: string;
  attachToObject: boolean;
  boneName: string;
  useSecondary: boolean;
  cameraEffectType: number;
  cameraDuration: number;
  cameraFrequency: number;
  cameraXAmp: number;
  cameraYAmp: number;
  cameraZAmp: number;
  cameraRotFrequency: number;
  cameraRoll: number;
  cameraPitch: number;
  cameraYaw: number;
  AudioEventGUID: string;
  renderEffectType: number;
  renderEffectTime: number;
  renderStartVal: number;
  renderEndVal: number;
  renderDelayVal: number;
  renderValue1: number;
  renderValue2: number;
  renderValue3: number;
  renderRGBA: string;
  renderShaderVal: number;
  motionID: number;
  meshID: number;
  meshDuration: number;
  meshLockedNode: string;
}

export interface BehaviorParameter {
  behaviorID: number;
  parameterID: string;
  value: number;
}

export interface BehaviorTemplate {
  behaviorID: number;
  templateID: number;
  effectID: number;
  effectHandle: string;
}

export interface BehaviorTemplateName {
  templateID: number;
  name: string;
}

export interface Blueprints {
  id: number;
  name: string;
  description: string;
  accountid: number;
  characterid: number;
  price: number;
  rating: number;
  categoryid: number;
  lxfpath: string;
  deleted: boolean;
  created: number;
  modified: number;
}

export interface BrickColors {
  id: number;
  red: number;
  green: number;
  blue: number;
  alpha: number;
  legopaletteid: number;
  description: string;
  validTypes: number;
  validCharacters: number;
  factoryValid: boolean;
}

export interface BrickIDTable {
  NDObjectID: number;
  LEGOBrickID: number;
}

export interface BuffDefinitions {
  ID: number;
  Priority: number;
  UIIcon: string;
}

export interface BuffParameters {
  BuffID: number;
  ParameterName: string;
  NumberValue: number;
  StringValue: string;
  EffectID: number;
}

export interface Camera {
  cameraName: string;
  pitchAngleTolerance: number;
  startingZoom: number;
  zoomReturnModifier: number;
  pitchReturnModifier: number;
  tetherOutReturnModifier: number;
  tetherInReturnMultiplier: number;
  verticleMovementDampeningModifier: number;
  returnFromInclineModifier: number;
  horizontalReturnModifier: number;
  yawBehaviorSpeedMultiplier: number;
  cameraCollisionPadding: number;
  glideSpeed: number;
  fadePlayerMinRange: number;
  minMovementDeltaTolerance: number;
  minGlideDistanceTolerance: number;
  lookForwardOffset: number;
  lookUpOffset: number;
  minimumVerticalDampeningDistance: number;
  maximumVerticalDampeningDistance: number;
  minimumIgnoreJumpDistance: number;
  maximumIgnoreJumpDistance: number;
  maximumAutoGlideAngle: number;
  minimumTetherGlideDistance: number;
  yawSignCorrection: number;
  set1LookForwardOffset: number;
  set1LookUpOffset: number;
  set2LookForwardOffset: number;
  set2LookUpOffset: number;
  set0SpeedInfluenceOnDir: number;
  set1SpeedInfluenceOnDir: number;
  set2SpeedInfluenceOnDir: number;
  set0AngularRelaxation: number;
  set1AngularRelaxation: number;
  set2AngularRelaxation: number;
  set0PositionUpOffset: number;
  set1PositionUpOffset: number;
  set2PositionUpOffset: number;
  set0PositionForwardOffset: number;
  set1PositionForwardOffset: number;
  set2PositionForwardOffset: number;
  set0FOV: number;
  set1FOV: number;
  set2FOV: number;
  set0MaxYawAngle: number;
  set1MaxYawAngle: number;
  set2MaxYawAngle: number;
  set1FadeInCameraSetChange: number;
  set1FadeOutCameraSetChange: number;
  set2FadeInCameraSetChange: number;
  set2FadeOutCameraSetChange: number;
  inputMovementScalar: number;
  inputRotationScalar: number;
  inputZoomScalar: number;
  minimumPitchDesired: number;
  maximumPitchDesired: number;
  minimumZoom: number;
  maximumZoom: number;
  horizontalRotateTolerance: number;
  horizontalRotateModifier: number;
}

export interface CelebrationParameters {
  id: number;
  animation: string;
  backgroundObject: number;
  duration: number;
  subText: string;
  mainText: string;
  iconID: number;
  celeLeadIn: number;
  celeLeadOut: number;
  cameraPathLOT: number;
  pathNodeName: string;
  ambientR: number;
  ambientG: number;
  ambientB: number;
  directionalR: number;
  directionalG: number;
  directionalB: number;
  specularR: number;
  specularG: number;
  specularB: number;
  lightPositionX: number;
  lightPositionY: number;
  lightPositionZ: number;
  blendTime: number;
  fogColorR: number;
  fogColorG: number;
  fogColorB: number;
  musicCue: string;
  soundGUID: string;
  mixerProgram: string;
}

export interface ChoiceBuildComponent {
  id: number;
  selections: string;
  imaginationOverride: number;
}

export interface CollectibleComponent {
  id: number;
  requirementMission: number;
}

export interface ComponentsRegistry {
  id: number;
  componentType: number;
  componentId: number;
}

export interface ControlSchemes {
  controlScheme: number;
  schemeName: string;
  rotationSpeed: number;
  walkForwardSpeed: number;
  walkBackwardSpeed: number;
  walkStrafeSpeed: number;
  walkStrafeForwardSpeed: number;
  walkStrafeBackwardSpeed: number;
  runBackwardSpeed: number;
  runStrafeSpeed: number;
  runStrafeForwardSpeed: number;
  runStrafeBackwardSpeed: number;
  keyboardZoomSensitivity: number;
  keyboardPitchSensitivity: number;
  keyboardYawSensitivity: number;
  mouseZoomWheelSensitivity: number;
  xMouseMoveSensitivityModifier: number;
  yMouseMoveSensitivityModifier: number;
  freecamSpeedModifier: number;
  freecamSlowSpeedMultiplier: number;
  freecamFastSpeedMultiplier: number;
  freecamMouseModifier: number;
  gamepadPitchRotSensitivity: number;
  gamepadYawRotSensitivity: number;
  gamepadTriggerSensitivity: number;
}

export interface CurrencyDenominations {
  value: number;
  objectid: number;
}

export interface CurrencyTable {
  currencyIndex: number;
  npcminlevel: number;
  minvalue: number;
  maxvalue: number;
  id: number;
}

export interface DBExclude {
  table: string;
  column: string;
}

export interface DeletionRestrictions {
  id: number;
  restricted: boolean;
  ids: string;
  checkType: number;
  localize: boolean;
  locStatus: number;
  gateVersion: string;
}

export interface DestructibleComponent {
  id: number;
  faction: number;
  factionList: string;
  life: number;
  imagination: number;
  LootMatrixIndex: number;
  CurrencyIndex: number;
  level: number;
  armor: number;
  deathBehavior: number;
  isnpc: boolean;
  attackPriority: number;
  isSmashable: boolean;
  difficultyLevel: number;
}

export interface DevModelBehaviors {
  ModelID: number;
  BehaviorID: number;
}

export interface Emotes {
  id: number;
  animationName: string;
  iconFilename: string;
  channel: string;
  command: string;
  locked: boolean;
  localize: boolean;
  locStatus: number;
  gateVersion: string;
}

export interface EventGating {
  eventName: string;
  dateStart: number;
  dateEnd: number;
}

export interface ExhibitComponent {
  id: number;
  length: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  fReputationSizeMultiplier: number;
  fImaginationCost: number;
}

export interface Factions {
  faction: number;
  factionList: string;
  factionListFriendly: boolean;
  friendList: string;
  enemyList: string;
}

export interface FeatureGating {
  featureName: string;
  major: number;
  current: number;
  minor: number;
  description: string;
}

export interface FlairTable {
  id: number;
  asset: string;
}

export interface Icons {
  IconID: number;
  IconPath: string;
  IconName: string;
}

export interface InventoryComponent {
  id: number;
  itemid: number;
  count: number;
  equip: boolean;
}

export interface ItemComponent {
  id: number;
  equipLocation: string;
  baseValue: number;
  isKitPiece: boolean;
  rarity: number;
  itemType: number;
  itemInfo: number;
  inLootTable: boolean;
  inVendor: boolean;
  isUnique: boolean;
  isBOP: boolean;
  isBOE: boolean;
  reqFlagID: number;
  reqSpecialtyID: number;
  reqSpecRank: number;
  reqAchievementID: number;
  stackSize: number;
  color1: number;
  decal: number;
  offsetGroupID: number;
  buildTypes: number;
  reqPrecondition: string;
  animationFlag: number;
  equipEffects: number;
  readyForQA: boolean;
  itemRating: number;
  isTwoHanded: boolean;
  minNumRequired: number;
  delResIndex: number;
  currencyLOT: number;
  altCurrencyCost: number;
  subItems: string;
  audioEventUse: string;
  noEquipAnimation: boolean;
  commendationLOT: number;
  commendationCost: number;
  audioEquipMetaEventSet: string;
  currencyCosts: string;
  ingredientInfo: string;
  locStatus: number;
  forgeType: number;
  SellMultiplier: number;
}

export interface ItemEggData {
  id: number;
  chassieTypeId: number;
}

export interface ItemFoodData {
  id: number;
  element1: number;
  element1Amount: number;
  element2: number;
  element2Amount: number;
  element3: number;
  element3Amount: number;
  element4: number;
  element4Amount: number;
}

export interface ItemSetSkills {
  SkillSetID: number;
  SkillID: number;
  SkillCastType: number;
}

export interface ItemSets {
  setID: number;
  locStatus: number;
  itemIDs: string;
  kitType: number;
  kitRank: number;
  kitImage: number;
  skillSetWith2: number;
  skillSetWith3: number;
  skillSetWith4: number;
  skillSetWith5: number;
  skillSetWith6: number;
  localize: boolean;
  gateVersion: string;
  kitID: number;
  priority: number;
}

export interface JetPackPadComponent {
  id: number;
  xDistance: number;
  yDistance: number;
  warnDistance: number;
  lotBlocker: number;
  lotWarningVolume: number;
}

export interface LUPExhibitComponent {
  id: number;
  minXZ: number;
  maxXZ: number;
  maxY: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
}

export interface LUPExhibitModelData {
  LOT: number;
  minXZ: number;
  maxXZ: number;
  maxY: number;
  description: string;
  owner: string;
}

export interface LUPZoneIDs {
  zoneID: number;
}

export interface LanguageType {
  LanguageID: number;
  LanguageDescription: string;
}

export interface LevelProgressionLookup {
  id: number;
  requiredUScore: number;
  BehaviorEffect: string;
}

export interface LootMatrix {
  LootMatrixIndex: number;
  LootTableIndex: number;
  RarityTableIndex: number;
  percent: number;
  minToDrop: number;
  maxToDrop: number;
  id: number;
  flagID: number;
  gateVersion: string;
}

export interface LootMatrixIndex {
  LootMatrixIndex: number;
  inNpcEditor: boolean;
}

export interface LootTable {
  itemid: number;
  LootTableIndex: number;
  id: number;
  MissionDrop: boolean;
  sortPriority: number;
}

export interface LootTableIndex {
  LootTableIndex: number;
}

export interface MinifigComponent {
  id: number;
  head: number;
  chest: number;
  legs: number;
  hairstyle: number;
  haircolor: number;
  chestdecal: number;
  headcolor: number;
  lefthand: number;
  righthand: number;
  eyebrowstyle: number;
  eyesstyle: number;
  mouthstyle: number;
}

export interface MinifigDecalsEyebrows {
  ID: number;
  HighPath: string;
  LowPath: string;
  CharacterCreateValid: boolean;
  male: boolean;
  female: boolean;
}

export interface MinifigDecalsEyes {
  ID: number;
  HighPath: string;
  LowPath: string;
  CharacterCreateValid: boolean;
  male: boolean;
  female: boolean;
}

export interface MinifigDecalsLegs {
  ID: number;
  HighPath: string;
}

export interface MinifigDecalsMouths {
  ID: number;
  HighPath: string;
  LowPath: string;
  CharacterCreateValid: boolean;
  male: boolean;
  female: boolean;
}

export interface MinifigDecalsTorsos {
  ID: number;
  HighPath: string;
  CharacterCreateValid: boolean;
  male: boolean;
  female: boolean;
}

export interface MissionEmail {
  ID: number;
  messageType: number;
  notificationGroup: number;
  missionID: number;
  attachmentLOT: number;
  localize: boolean;
  locStatus: number;
  gateVersion: string;
}

export interface MissionNPCComponent {
  id: number;
  missionID: number;
  offersMission: boolean;
  acceptsMission: boolean;
  gateVersion: string;
}

export interface MissionTasks {
  id: number;
  locStatus: number;
  taskType: number;
  target: number;
  targetGroup: string;
  targetValue: number;
  taskParam1: string;
  largeTaskIcon: string;
  IconID: number;
  uid: number;
  largeTaskIconID: number;
  localize: boolean;
  gateVersion: string;
}

export interface MissionText {
  id: number;
  storyIcon: string;
  missionIcon: string;
  offerNPCIcon: string;
  IconID: number;
  state1Anim: string;
  state2Anim: string;
  state3Anim: string;
  state4Anim: string;
  state3TurninAnim: string;
  state4TurninAnim: string;
  onclickAnim: string;
  CinematicAccepted: string;
  CinematicAcceptedLeadin: number;
  CinematicCompleted: string;
  CinematicCompletedLeadin: number;
  CinematicRepeatable: string;
  CinematicRepeatableLeadin: number;
  CinematicRepeatableCompleted: string;
  CinematicRepeatableCompletedLeadin: number;
  AudioEventGUIDInteract: string;
  AudioEventGUIDOfferAccept: string;
  AudioEventGUIDOfferDeny: string;
  AudioEventGUIDCompleted: string;
  AudioEventGUIDTurnIn: string;
  AudioEventGUIDFailed: string;
  AudioEventGUIDProgress: string;
  AudioMusicCueOfferAccept: string;
  AudioMusicCueTurnIn: string;
  turnInIconID: number;
  localize: boolean;
  locStatus: number;
  gateVersion: string;
}

export interface Missions {
  id: number;
  definedType: string;
  definedSubtype: string;
  UISortOrder: number;
  offerObjectID: number;
  targetObjectID: number;
  rewardCurrency: number;
  LegoScore: number;
  rewardReputation: number;
  isChoiceReward: boolean;
  rewardItem1: number;
  rewardItem1Count: number;
  rewardItem2: number;
  rewardItem2Count: number;
  rewardItem3: number;
  rewardItem3Count: number;
  rewardItem4: number;
  rewardItem4Count: number;
  rewardEmote: number;
  rewardEmote2: number;
  rewardEmote3: number;
  rewardEmote4: number;
  rewardMaximagination: number;
  rewardMaxhealth: number;
  rewardMaxinventory: number;
  rewardMaxmodel: number;
  rewardMaxwidget: number;
  rewardMaxwallet: number;
  repeatable: boolean;
  rewardCurrencyRepeatable: number;
  rewardItem1Repeatable: number;
  rewardItem1RepeatCount: number;
  rewardItem2Repeatable: number;
  rewardItem2RepeatCount: number;
  rewardItem3Repeatable: number;
  rewardItem3RepeatCount: number;
  rewardItem4Repeatable: number;
  rewardItem4RepeatCount: number;
  timeLimit: number;
  isMission: boolean;
  missionIconID: number;
  prereqMissionID: string;
  localize: boolean;
  inMOTD: boolean;
  cooldownTime: number;
  isRandom: boolean;
  randomPool: string;
  UIPrereqID: number;
  gateVersion: string;
  HUDStates: string;
  locStatus: number;
  rewardBankinventory: number;
}

export interface ModelBehavior {
  id: number;
  definitionXMLfilename: string;
}

export interface ModularBuildComponent {
  id: number;
  buildType: number;
  xml: string;
  createdLOT: number;
  createdPhysicsID: number;
  AudioEventGUIDSnap: string;
  AudioEventGUIDComplete: string;
  AudioEventGUIDPresent: string;
}

export interface ModuleComponent {
  id: number;
  partCode: number;
  buildType: number;
  xml: string;
  primarySoundGUID: string;
  assembledEffectID: number;
}

export interface MotionFX {
  id: number;
  typeID: number;
  slamVelocity: number;
  addVelocity: number;
  duration: number;
  destGroupName: string;
  startScale: number;
  endScale: number;
  velocity: number;
  distance: number;
}

export interface MovementAIComponent {
  id: number;
  MovementType: string;
  WanderChance: number;
  WanderDelayMin: number;
  WanderDelayMax: number;
  WanderSpeed: number;
  WanderRadius: number;
  attachedPath: string;
}

export interface MovingPlatforms {
  id: number;
  platformIsSimpleMover: boolean;
  platformMoveX: number;
  platformMoveY: number;
  platformMoveZ: number;
  platformMoveTime: number;
  platformStartAtEnd: boolean;
  description: string;
}

export interface NpcIcons {
  id: number;
  color: number;
  offset: number;
  LOT: number;
  Texture: string;
  isClickable: boolean;
  scale: number;
  rotateToFace: boolean;
  compositeHorizOffset: number;
  compositeVertOffset: number;
  compositeScale: number;
  compositeConnectionNode: string;
  compositeLOTMultiMission: number;
  compositeLOTMultiMissionVentor: number;
  compositeIconTexture: string;
}

export interface ObjectBehaviorXREF {
  LOT: number;
  behaviorID1: number;
  behaviorID2: number;
  behaviorID3: number;
  behaviorID4: number;
  behaviorID5: number;
  type: number;
}

export interface ObjectBehaviors {
  BehaviorID: number;
  xmldata: string;
}

export interface ObjectSkills {
  objectTemplate: number;
  skillID: number;
  castOnType: number;
  AICombatWeight: number;
}

export interface Objects {
  id: number;
  name: string;
  placeable: boolean;
  type: string;
  description: string;
  localize: boolean;
  npcTemplateID: number;
  displayName: string;
  interactionDistance: number;
  nametag: boolean;
  InternalNotes: string;
  locStatus: number;
  gateVersion: string;
  HQValid: boolean;
}

export interface PackageComponent {
  id: number;
  LootMatrixIndex: number;
  packageType: number;
}

export interface PetAbilities {
  id: number;
  AbilityName: string;
  ImaginationCost: number;
  locStatus: number;
}

export interface PetComponent {
  id: number;
  minTameUpdateTime: number;
  maxTameUpdateTime: number;
  percentTameChance: number;
  tamability: number;
  elementType: number;
  walkSpeed: number;
  runSpeed: number;
  sprintSpeed: number;
  idleTimeMin: number;
  idleTimeMax: number;
  petForm: number;
  imaginationDrainRate: number;
  AudioMetaEventSet: string;
  buffIDs: string;
}

export interface PetNestComponent {
  id: number;
  ElementalType: number;
}

export interface PhysicsComponent {
  id: number;
  static: number;
  physicsAsset: string;
  jump: number;
  doublejump: number;
  speed: number;
  rotSpeed: number;
  playerHeight: number;
  playerRadius: number;
  pcShapeType: number;
  collisionGroup: number;
  airSpeed: number;
  boundaryAsset: string;
  jumpAirSpeed: number;
  friction: number;
  gravityVolumeAsset: string;
}

export interface PlayerFlags {
  id: number;
  SessionOnly: boolean;
  OnlySetByServer: boolean;
  SessionZoneOnly: boolean;
}

export interface PlayerStatistics {
  statID: number;
  sortOrder: number;
  locStatus: number;
  gateVersion: string;
}

export interface PossessableComponent {
  id: number;
  controlSchemeID: number;
  minifigAttachPoint: string;
  minifigAttachAnimation: string;
  minifigDetachAnimation: string;
  mountAttachAnimation: string;
  mountDetachAnimation: string;
  attachOffsetFwd: number;
  attachOffsetRight: number;
  possessionType: number;
  wantBillboard: boolean;
  billboardOffsetUp: number;
  depossessOnHit: boolean;
  hitStunTime: number;
  skillSet: number;
}

export interface Preconditions {
  id: number;
  type: number;
  targetLOT: string;
  targetGroup: string;
  targetCount: number;
  iconID: number;
  localize: boolean;
  validContexts: number;
  locStatus: number;
  gateVersion: string;
}

export interface PropertyEntranceComponent {
  id: number;
  mapID: number;
  propertyName: string;
  isOnProperty: boolean;
  groupType: string;
}

export interface PropertyTemplate {
  id: number;
  mapID: number;
  vendorMapID: number;
  spawnName: string;
  type: number;
  sizecode: number;
  minimumPrice: number;
  rentDuration: number;
  path: string;
  cloneLimit: number;
  durationType: number;
  achievementRequired: number;
  zoneX: number;
  zoneY: number;
  zoneZ: number;
  maxBuildHeight: number;
  localize: boolean;
  reputationPerMinute: number;
  locStatus: number;
  gateVersion: string;
}

export interface ProximityMonitorComponent {
  id: number;
  Proximities: string;
  LoadOnClient: boolean;
  LoadOnServer: boolean;
}

export interface ProximityTypes {
  id: number;
  Name: string;
  Radius: number;
  CollisionGroup: number;
  PassiveChecks: boolean;
  IconID: number;
  LoadOnClient: boolean;
  LoadOnServer: boolean;
}

export interface RacingModuleComponent {
  id: number;
  topSpeed: number;
  acceleration: number;
  handling: number;
  stability: number;
  imagination: number;
}

export interface RailActivatorComponent {
  id: number;
  startAnim: string;
  loopAnim: string;
  stopAnim: string;
  startSound: string;
  loopSound: string;
  stopSound: string;
  effectIDs: string;
  preconditions: string;
  playerCollision: boolean;
  cameraLocked: boolean;
  StartEffectID: string;
  StopEffectID: string;
  DamageImmune: boolean;
  NoAggro: boolean;
  ShowNameBillboard: boolean;
}

export interface RarityTable {
  id: number;
  randmax: number;
  rarity: number;
  RarityTableIndex: number;
}

export interface RarityTableIndex {
  RarityTableIndex: number;
}

export interface RebuildComponent {
  id: number;
  resetTime: number;
  completeTime: number;
  takeImagination: number;
  interruptible: boolean;
  selfActivator: boolean;
  customModules: string;
  activityID: number;
  postImaginationCost: number;
  timeBeforeSmash: number;
}

export interface RebuildSections {
  id: number;
  rebuildID: number;
  objectID: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  fallAngleX: number;
  fallAngleY: number;
  fallAngleZ: number;
  fallHeight: number;
  requiresList: string;
  size: number;
  bPlaced: boolean;
}

export interface ReleaseVersion {
  ReleaseVersion: string;
  ReleaseDate: number;
}

export interface RenderComponent {
  id: number;
  renderAsset: string;
  iconAsset: string;
  IconID: number;
  shaderId: number;
  effect1: number;
  effect2: number;
  effect3: number;
  effect4: number;
  effect5: number;
  effect6: number;
  animationGroupIDs: string;
  fade: boolean;
  usedropshadow: boolean;
  preloadAnimations: boolean;
  fadeInTime: number;
  maxShadowDistance: number;
  ignoreCameraCollision: boolean;
  renderComponentLOD1: number;
  renderComponentLOD2: number;
  gradualSnap: boolean;
  animationFlag: number;
  AudioMetaEventSet: string;
  billboardHeight: number;
  chatBubbleOffset: number;
  staticBillboard: boolean;
  LXFMLFolder: string;
  attachIndicatorsToNode: boolean;
}

export interface RenderComponentFlash {
  id: number;
  interactive: boolean;
  animated: boolean;
  nodeName: string;
  flashPath: string;
  elementName: string;
  Uid: number;
}

export interface RenderComponentWrapper {
  id: number;
  defaultWrapperAsset: string;
}

export interface RenderIconAssets {
  id: number;
  iconAsset: string;
  blankColumn: string;
}

export interface ReputationRewards {
  repLevel: number;
  sublevel: number;
  reputation: number;
}

export interface RewardCodes {
  id: number;
  code: string;
  attachmentLOT: number;
  locStatus: number;
  gateVersion: string;
}

export interface Rewards {
  id: number;
  LevelID: number;
  MissionID: number;
  RewardType: number;
  value: number;
  count: number;
}

export interface RocketLaunchpadControlComponent {
  id: number;
  targetZone: number;
  defaultZoneID: number;
  targetScene: string;
  gmLevel: number;
  playerAnimation: string;
  rocketAnimation: string;
  launchMusic: string;
  useLaunchPrecondition: boolean;
  useAltLandingPrecondition: boolean;
  launchPrecondition: string;
  altLandingPrecondition: string;
  altLandingSpawnPointName: string;
}

export interface SceneTable {
  sceneID: number;
  sceneName: string;
}

export interface ScriptComponent {
  id: number;
  scriptName: string;
  clientScriptName: string;
}

export interface SkillBehavior {
  skillID: number;
  locStatus: number;
  behaviorID: number;
  imaginationcost: number;
  cooldowngroup: number;
  cooldown: number;
  inNpcEditor: boolean;
  skillIcon: number;
  oomSkillID: string;
  oomBehaviorEffectID: number;
  castTypeDesc: number;
  imBonusUI: number;
  lifeBonusUI: number;
  armorBonusUI: number;
  damageUI: number;
  hideIcon: boolean;
  localize: boolean;
  gateVersion: string;
  cancelType: number;
}

export interface SmashableChain {
  chainIndex: number;
  chainLevel: number;
  lootMatrixID: number;
  rarityTableIndex: number;
  currencyIndex: number;
  currencyLevel: number;
  smashCount: number;
  timeLimit: number;
  chainStepID: number;
}

export interface SmashableChainIndex {
  id: number;
  targetGroup: string;
  description: string;
  continuous: number;
}

export interface SmashableComponent {
  id: number;
  LootMatrixIndex: number;
}

export interface SmashableElements {
  elementID: number;
  dropWeight: number;
}

export interface SpeedchatMenu {
  id: number;
  parentId: number;
  emoteId: number;
  imageName: string;
  localize: boolean;
  locStatus: number;
  gateVersion: string;
}

export interface SubscriptionPricing {
  id: number;
  countryCode: string;
  monthlyFeeGold: string;
  monthlyFeeSilver: string;
  monthlyFeeBronze: string;
  monetarySymbol: number;
  symbolIsAppended: boolean;
}

export interface SurfaceType {
  SurfaceType: number;
  FootstepNDAudioMetaEventSetName: string;
}

export interface TamingBuildPuzzles {
  id: number;
  PuzzleModelLot: number;
  NPCLot: number;
  ValidPiecesLXF: string;
  InvalidPiecesLXF: string;
  Difficulty: number;
  Timelimit: number;
  NumValidPieces: number;
  TotalNumPieces: number;
  ModelName: string;
  FullModelLXF: string;
  Duration: number;
  imagCostPerBuild: number;
}

export interface TextDescription {
  TextID: number;
  TestDescription: string;
}

export interface TextLanguage {
  TextID: number;
  LanguageID: number;
  Text: string;
}

export interface TrailEffects {
  trailID: number;
  textureName: string;
  blendmode: number;
  cardlifetime: number;
  colorlifetime: number;
  minTailFade: number;
  tailFade: number;
  maxParticles: number;
  birthDelay: number;
  deathDelay: number;
  bone1: string;
  bone2: string;
  texLength: number;
  texWidth: number;
  startColorR: number;
  startColorG: number;
  startColorB: number;
  startColorA: number;
  middleColorR: number;
  middleColorG: number;
  middleColorB: number;
  middleColorA: number;
  endColorR: number;
  endColorG: number;
  endColorB: number;
  endColorA: number;
}

export interface UGBehaviorSounds {
  id: number;
  guid: string;
  localize: boolean;
  locStatus: number;
  gateVersion: string;
}

export interface VehiclePhysics {
  id: number;
  hkxFilename: string;
  fGravityScale: number;
  fMass: number;
  fChassisFriction: number;
  fMaxSpeed: number;
  fEngineTorque: number;
  fBrakeFrontTorque: number;
  fBrakeRearTorque: number;
  fBrakeMinInputToBlock: number;
  fBrakeMinTimeToBlock: number;
  fSteeringMaxAngle: number;
  fSteeringSpeedLimitForMaxAngle: number;
  fSteeringMinAngle: number;
  fFwdBias: number;
  fFrontTireFriction: number;
  fRearTireFriction: number;
  fFrontTireFrictionSlide: number;
  fRearTireFrictionSlide: number;
  fFrontTireSlipAngle: number;
  fRearTireSlipAngle: number;
  fWheelWidth: number;
  fWheelRadius: number;
  fWheelMass: number;
  fReorientPitchStrength: number;
  fReorientRollStrength: number;
  fSuspensionLength: number;
  fSuspensionStrength: number;
  fSuspensionDampingCompression: number;
  fSuspensionDampingRelaxation: number;
  iChassisCollisionGroup: number;
  fNormalSpinDamping: number;
  fCollisionSpinDamping: number;
  fCollisionThreshold: number;
  fTorqueRollFactor: number;
  fTorquePitchFactor: number;
  fTorqueYawFactor: number;
  fInertiaRoll: number;
  fInertiaPitch: number;
  fInertiaYaw: number;
  fExtraTorqueFactor: number;
  fCenterOfMassFwd: number;
  fCenterOfMassUp: number;
  fCenterOfMassRight: number;
  fWheelHardpointFrontFwd: number;
  fWheelHardpointFrontUp: number;
  fWheelHardpointFrontRight: number;
  fWheelHardpointRearFwd: number;
  fWheelHardpointRearUp: number;
  fWheelHardpointRearRight: number;
  fInputTurnSpeed: number;
  fInputDeadTurnBackSpeed: number;
  fInputAccelSpeed: number;
  fInputDeadAccelDownSpeed: number;
  fInputDecelSpeed: number;
  fInputDeadDecelDownSpeed: number;
  fInputSlopeChangePointX: number;
  fInputInitialSlope: number;
  fInputDeadZone: number;
  fAeroAirDensity: number;
  fAeroFrontalArea: number;
  fAeroDragCoefficient: number;
  fAeroLiftCoefficient: number;
  fAeroExtraGravity: number;
  fBoostTopSpeed: number;
  fBoostCostPerSecond: number;
  fBoostAccelerateChange: number;
  fBoostDampingChange: number;
  fPowerslideNeutralAngle: number;
  fPowerslideTorqueStrength: number;
  iPowerslideNumTorqueApplications: number;
  fImaginationTankSize: number;
  fSkillCost: number;
  fWreckSpeedBase: number;
  fWreckSpeedPercent: number;
  fWreckMinAngle: number;
  AudioEventEngine: string;
  AudioEventSkid: string;
  AudioEventLightHit: string;
  AudioSpeedThresholdLightHit: number;
  AudioTimeoutLightHit: number;
  AudioEventHeavyHit: string;
  AudioSpeedThresholdHeavyHit: number;
  AudioTimeoutHeavyHit: number;
  AudioEventStart: string;
  AudioEventTreadConcrete: string;
  AudioEventTreadSand: string;
  AudioEventTreadWood: string;
  AudioEventTreadDirt: string;
  AudioEventTreadPlastic: string;
  AudioEventTreadGrass: string;
  AudioEventTreadGravel: string;
  AudioEventTreadMud: string;
  AudioEventTreadWater: string;
  AudioEventTreadSnow: string;
  AudioEventTreadIce: string;
  AudioEventTreadMetal: string;
  AudioEventTreadLeaves: string;
  AudioEventLightLand: string;
  AudioAirtimeForLightLand: number;
  AudioEventHeavyLand: string;
  AudioAirtimeForHeavyLand: number;
  bWheelsVisible: boolean;
}

export interface VehicleStatMap {
  id: number;
  ModuleStat: string;
  HavokStat: string;
  HavokChangePerModuleStat: number;
}

export interface VendorComponent {
  id: number;
  buyScalar: number;
  sellScalar: number;
  refreshTimeSeconds: number;
  LootMatrixIndex: number;
}

export interface WhatsCoolItemSpotlight {
  id: number;
  itemID: number;
  localize: boolean;
  gateVersion: string;
  locStatus: number;
}

export interface WhatsCoolNewsAndTips {
  id: number;
  iconID: number;
  type: number;
  localize: boolean;
  gateVersion: string;
  locStatus: number;
}

export interface WorldConfig {
  WorldConfigID: number;
  pegravityvalue: number;
  pebroadphaseworldsize: number;
  pegameobjscalefactor: number;
  characterRotationSpeed: number;
  characterWalkForwardSpeed: number;
  characterWalkBackwardSpeed: number;
  characterWalkStrafeSpeed: number;
  characterWalkStrafeForwardSpeed: number;
  characterWalkStrafeBackwardSpeed: number;
  characterRunBackwardSpeed: number;
  characterRunStrafeSpeed: number;
  characterRunStrafeForwardSpeed: number;
  characterRunStrafeBackwardSpeed: number;
  globalCooldown: number;
  characterGroundedTime: number;
  characterGroundedSpeed: number;
  globalImmunityTime: number;
  characterMaxSlope: number;
  defaultrespawntime: number;
  missionTooltipTimeout: number;
  vendorBuyMultiplier: number;
  petFollowRadius: number;
  characterEyeHeight: number;
  flightVerticalVelocity: number;
  flightAirspeed: number;
  flightFuelRatio: number;
  flightMaxAirspeed: number;
  fReputationPerVote: number;
  nPropertyCloneLimit: number;
  defaultHomespaceTemplate: number;
  coinsLostOnDeathPercent: number;
  coinsLostOnDeathMin: number;
  coinsLostOnDeathMax: number;
  characterVotesPerDay: number;
  propertyModerationRequestApprovalCost: number;
  propertyModerationRequestReviewCost: number;
  propertyModRequestsAllowedSpike: number;
  propertyModRequestsAllowedInterval: number;
  propertyModRequestsAllowedTotal: number;
  propertyModRequestsSpikeDuration: number;
  propertyModRequestsIntervalDuration: number;
  modelModerateOnCreate: boolean;
  defaultPropertyMaxHeight: number;
  reputationPerVoteCast: number;
  reputationPerVoteReceived: number;
  showcaseTopModelConsiderationBattles: number;
  reputationPerBattlePromotion: number;
  coinsLostOnDeathMinTimeout: number;
  coinsLostOnDeathMaxTimeout: number;
  mailBaseFee: number;
  mailPercentAttachmentFee: number;
  propertyReputationDelay: number;
  LevelCap: number;
  LevelUpBehaviorEffect: string;
  CharacterVersion: number;
  LevelCapCurrencyConversion: number;
}

export interface ZoneLoadingTips {
  id: number;
  zoneid: number;
  imagelocation: string;
  localize: boolean;
  gateVersion: string;
  locStatus: number;
  weight: number;
  targetVersion: string;
}

export interface ZoneSummary {
  zoneID: number;
  type: number;
  value: number;
  UniqueID: number;
}

export interface ZoneTable {
  zoneID: number;
  locStatus: number;
  zoneName: string;
  scriptID: number;
  ghostdistanceMin: number;
  ghostdistance: number;
  populationSoftCap: number;
  populationHardCap: number;
  DisplayDescription: string;
  mapFolder: string;
  smashableMinDistance: number;
  smashableMaxDistance: number;
  mixerProgram: string;
  clientPhysicsFramerate: string;
  serverPhysicsFramerate: string;
  zoneControlTemplate: number;
  widthInChunks: number;
  heightInChunks: number;
  petsAllowed: boolean;
  localize: boolean;
  fZoneWeight: number;
  thumbnail: string;
  PlayerLoseCoinsOnDeath: boolean;
  disableSaveLoc: boolean;
  teamRadius: number;
  gateVersion: string;
  mountsAllowed: boolean;
}

export interface brickAttributes {
  ID: number;
  iconAsset: string;
  displayOrder: number;
  locStatus: number;
}

export interface dtproperties {
  id: number;
  objectid: number;
  property: string;
  value: string;
  uvalue: string;
  lvalue: undefined;
  version: number;
}

export interface mapAnimationPriorities {
  id: number;
  name: string;
  priority: number;
}

export interface mapAssetType {
  id: number;
  label: string;
  pathdir: string;
  typelabel: string;
}

export interface mapIcon {
  LOT: number;
  iconID: number;
  iconState: number;
}

export interface mapItemTypes {
  id: number;
  description: string;
  equipLocation: string;
}

export interface mapRenderEffects {
  id: number;
  gameID: number;
  description: string;
}

export interface mapShaders {
  id: number;
  label: string;
  gameValue: number;
  priority: number;
}

export interface mapTextureResource {
  id: number;
  texturepath: string;
  SurfaceType: number;
}

export interface mapBlueprintCategory {
  id: number;
  description: string;
  enabled: boolean;
}

export interface sysdiagrams {
  name: string;
  principalId: number;
  diagramId: number;
  version: number;
  definition: string;
}
