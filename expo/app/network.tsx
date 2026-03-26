import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import {
  Users,
  MapPin,
  Building2,
  MessageCircle,
  Send,
  CheckCircle,
  Shield,
  Search,
  Plus,
  MessagesSquare,
} from 'lucide-react-native';
import {
  mockNetworkCommunities,
  type ProjectStatus,
  type OrganizingLevel,
} from '@/mocks/networkCommunities';

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Washington DC',
];

interface Message {
  id: string;
  channelId: string;
  author: string;
  timestamp: string;
  text: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  communityId?: string;
}

const mockChannels: Channel[] = [
  {
    id: 'national',
    name: 'National Strategy & Story Sharing',
    description: 'Share tactics, legal strategies, and campaign stories across communities',
  },
  {
    id: 'bowling-green-oh',
    name: 'Bowling Green, OH – Meta DC',
    description: 'Meta AI data center proposal discussion',
    communityId: 'bowling-green-oh',
  },
  {
    id: 'west-memphis-ar',
    name: 'West Memphis, AR – Google',
    description: 'Groot LLC / Project Pyramid organizing',
    communityId: 'west-memphis-ar',
  },
  {
    id: 'prince-william-va',
    name: 'Prince William County, VA',
    description: 'Data center moratorium and regulation strategy',
    communityId: 'prince-william-va',
  },
];

type NetworkTab = 'similar' | 'conversation' | 'forums';

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    channelId: 'national',
    author: 'Sarah M. (Virginia)',
    timestamp: '2 hours ago',
    text: 'We just got our county to pass a temporary moratorium on data center rezoning. Happy to share our talking points and organizing timeline.',
  },
  {
    id: 'msg-2',
    channelId: 'national',
    author: 'Mike D. (Ohio)',
    timestamp: '4 hours ago',
    text: 'Has anyone successfully gotten a CBA attached to a tax incentive package? Our developer is pushing back hard.',
  },
  {
    id: 'msg-3',
    channelId: 'bowling-green-oh',
    author: 'Local organizer',
    timestamp: '1 day ago',
    text: 'Planning commission meeting is next Tuesday. We need a strong turnout. Working on fact sheets about water use impacts.',
  },
  {
    id: 'msg-4',
    channelId: 'bowling-green-oh',
    author: 'Community member',
    timestamp: '1 day ago',
    text: 'I can bring 5-6 people from my neighborhood association. What time should we arrive?',
  },
  {
    id: 'msg-5',
    channelId: 'west-memphis-ar',
    author: 'Local advocate',
    timestamp: '3 days ago',
    text: 'Just filed a FOIA request for the full PILOT agreement. Will share what we get.',
  },
];

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<NetworkTab>('similar');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [communityName, setCommunityName] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [countyOrMunicipality, setCountyOrMunicipality] = useState<string>('');
  const [communityType, setCommunityType] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | ''>('');
  const [multipleProjects, setMultipleProjects] = useState<boolean>(false);
  const [developer, setDeveloper] = useState<string>('');
  const [llcOrCodename, setLlcOrCodename] = useState<string>('');
  const [zoning, setZoning] = useState<string>('');
  const [decisionMakers, setDecisionMakers] = useState<string[]>([]);
  const [organizingStrength, setOrganizingStrength] = useState<OrganizingLevel | ''>('');
  const [profileSaved, setProfileSaved] = useState<boolean>(false);

  const [filterDeveloper, setFilterDeveloper] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [selectedChannel, setSelectedChannel] = useState<string>('national');
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);

  const [newChannelTitle, setNewChannelTitle] = useState<string>('');
  const [newChannelDescription, setNewChannelDescription] = useState<string>('');
  const [newChannelFirstMessage, setNewChannelFirstMessage] = useState<string>('');
  const [linkToProfile, setLinkToProfile] = useState<boolean>(false);

  const handleSaveProfile = () => {
    console.log('Profile saved', {
      communityName,
      state,
      countyOrMunicipality,
      communityType,
      projectStatus,
      developer,
      organizingStrength,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const toggleDecisionMaker = (maker: string) => {
    if (decisionMakers.includes(maker)) {
      setDecisionMakers(decisionMakers.filter((m) => m !== maker));
    } else {
      setDecisionMakers([...decisionMakers, maker]);
    }
  };

  const matchedCommunities = useMemo(() => {
    if (!state || !projectStatus || !organizingStrength) {
      return [];
    }

    const scored = mockNetworkCommunities.map((community) => {
      let score = 0;

      if (community.developer.toLowerCase().includes(developer.toLowerCase())) {
        score += 3;
      }

      if (community.projectStatus === projectStatus) {
        score += 2;
      }

      if (community.state === state) {
        score += 2;
      }

      if (community.communityType === communityType) {
        score += 1;
      }

      return { community, score };
    });

    const filtered = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.community);

    let result = filtered;

    if (filterDeveloper !== 'All') {
      result = result.filter((c) =>
        c.developer.toLowerCase().includes(filterDeveloper.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      result = result.filter((c) => c.projectStatus === filterStatus);
    }

    return result;
  }, [
    state,
    projectStatus,
    organizingStrength,
    developer,
    communityType,
    filterDeveloper,
    filterStatus,
  ]);

  const handlePostMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      channelId: selectedChannel,
      author: communityName || 'You',
      timestamp: 'Just now',
      text: newMessage,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleViewChannel = (communityId: string) => {
    const channel = channels.find((ch) => ch.communityId === communityId);
    if (channel) {
      setSelectedChannel(channel.id);
      setActiveTab('conversation');
    }
  };

  const handleCreateChannel = () => {
    if (!newChannelTitle.trim()) return;

    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: newChannelTitle,
      description: newChannelDescription || 'Community discussion',
      ...(linkToProfile && communityName ? { communityId: communityName.toLowerCase().replace(/\s+/g, '-') } : {}),
    };

    setChannels([...channels, newChannel]);
    setSelectedChannel(newChannel.id);

    if (newChannelFirstMessage.trim()) {
      const firstMsg: Message = {
        id: `msg-${Date.now()}`,
        channelId: newChannel.id,
        author: communityName || 'You',
        timestamp: 'Just now',
        text: newChannelFirstMessage,
      };
      setMessages([...messages, firstMsg]);
    }

    setNewChannelTitle('');
    setNewChannelDescription('');
    setNewChannelFirstMessage('');
    setLinkToProfile(false);
  };

  const filteredCommunitiesForSearch = useMemo(() => {
    if (!searchQuery.trim() || activeTab !== 'similar') return matchedCommunities;

    const query = searchQuery.toLowerCase();
    return matchedCommunities.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.state.toLowerCase().includes(query) ||
        c.developer.toLowerCase().includes(query) ||
        c.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [matchedCommunities, searchQuery, activeTab]);

  const filteredChannelsForSearch = useMemo(() => {
    if (!searchQuery.trim() || (activeTab !== 'conversation' && activeTab !== 'forums')) return channels;

    const query = searchQuery.toLowerCase();
    return channels.filter(
      (ch) =>
        ch.name.toLowerCase().includes(query) ||
        ch.description.toLowerCase().includes(query)
    );
  }, [channels, searchQuery, activeTab]);

  const forumTopics = useMemo(() => {
    return [
      {
        id: 'tax-incentives',
        title: 'Tax Incentives & Subsidies',
        description: 'Strategies for negotiating or challenging tax incentive packages',
        threadCount: 12,
        channels: channels.filter((ch) =>
          ch.name.toLowerCase().includes('tax') ||
          ch.description.toLowerCase().includes('incentive') ||
          ch.description.toLowerCase().includes('abatement')
        ),
      },
      {
        id: 'water-cooling',
        title: 'Water & Cooling Systems',
        description: 'Water use impacts, cooling infrastructure, and environmental concerns',
        threadCount: 8,
        channels: channels.filter((ch) =>
          ch.name.toLowerCase().includes('water') ||
          ch.description.toLowerCase().includes('cooling') ||
          ch.description.toLowerCase().includes('environmental')
        ),
      },
      {
        id: 'zoning-ordinances',
        title: 'Zoning & Ordinances',
        description: 'Land use regulations, rezoning battles, and local ordinances',
        threadCount: 15,
        channels: channels.filter((ch) =>
          ch.name.toLowerCase().includes('zoning') ||
          ch.description.toLowerCase().includes('planning') ||
          ch.description.toLowerCase().includes('moratorium')
        ),
      },
      {
        id: 'organizing-tactics',
        title: 'Organizing Tactics',
        description: 'Coalition building, public engagement, and advocacy strategies',
        threadCount: 20,
        channels: channels.filter((ch) =>
          ch.name.toLowerCase().includes('organizing') ||
          ch.name.toLowerCase().includes('strategy') ||
          ch.name.toLowerCase().includes('national')
        ),
      },
    ];
  }, [channels]);

  return (
    <View style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Users size={48} color="#F59E0B" />
          <Text style={styles.heroTitle}>Community Network</Text>
          <Text style={styles.heroSubtitle}>
            Connect with communities facing similar data center projects. Share strategies,
            resources, and organizing tactics.
          </Text>
          <Text style={styles.heroNote}>
            This is an early MVP. Profiles and messages are stored locally for now.
          </Text>
        </View>

        <View style={styles.actionBar}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                activeTab === 'similar' && styles.actionButtonActive,
              ]}
              onPress={() => setActiveTab('similar')}
            >
              <Users size={20} color={activeTab === 'similar' ? '#92400E' : '#6B7280'} />
              <Text
                style={[
                  styles.actionButtonText,
                  activeTab === 'similar' && styles.actionButtonTextActive,
                ]}
              >
                Find Similar Communities
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                activeTab === 'conversation' && styles.actionButtonActive,
              ]}
              onPress={() => setActiveTab('conversation')}
            >
              <Plus size={20} color={activeTab === 'conversation' ? '#92400E' : '#6B7280'} />
              <Text
                style={[
                  styles.actionButtonText,
                  activeTab === 'conversation' && styles.actionButtonTextActive,
                ]}
              >
                Start a Conversation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                activeTab === 'forums' && styles.actionButtonActive,
              ]}
              onPress={() => setActiveTab('forums')}
            >
              <MessagesSquare size={20} color={activeTab === 'forums' ? '#92400E' : '#6B7280'} />
              <Text
                style={[
                  styles.actionButtonText,
                  activeTab === 'forums' && styles.actionButtonTextActive,
                ]}
              >
                Forums & Threads
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder={
                activeTab === 'similar'
                  ? 'Search communities, states, developers...'
                  : 'Search channels, topics, or threads...'
              }
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.content}>
          {activeTab === 'similar' && (
            <>
              <View style={styles.profileCard}>
            <View style={styles.cardHeader}>
              <MapPin size={24} color="#F59E0B" />
              <Text style={styles.cardTitle}>My Community Profile</Text>
            </View>
            <Text style={styles.cardDescription}>
              Tell us about your community so we can connect you with similar groups.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Community Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Bowling Green"
                placeholderTextColor="#9CA3AF"
                value={communityName}
                onChangeText={setCommunityName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>State *</Text>
              <View style={styles.statePickerContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.stateScroll}
                  contentContainerStyle={styles.stateScrollContent}
                >
                  {US_STATES.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.stateChip, state === s && styles.stateChipActive]}
                      onPress={() => setState(s)}
                    >
                      <Text
                        style={[
                          styles.stateChipText,
                          state === s && styles.stateChipTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>County / Municipality</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Wood County"
                placeholderTextColor="#9CA3AF"
                value={countyOrMunicipality}
                onChangeText={setCountyOrMunicipality}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Community Type *</Text>
              <View style={styles.optionsRow}>
                {['Rural', 'Small Town', 'Suburb', 'City'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      communityType === type && styles.optionButtonActive,
                    ]}
                    onPress={() => setCommunityType(type)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        communityType === type && styles.optionButtonTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Project Status *</Text>
              <View style={styles.radioGroup}>
                {[
                  'No project yet',
                  'Proposed',
                  'Planning / permitting',
                  'Under construction',
                  'Operating',
                ].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.radioButton,
                      projectStatus === status && styles.radioButtonActive,
                    ]}
                    onPress={() => setProjectStatus(status as ProjectStatus)}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        projectStatus === status && styles.radioCircleActive,
                      ]}
                    >
                      {projectStatus === status && <View style={styles.radioCircleFill} />}
                    </View>
                    <Text
                      style={[
                        styles.radioLabel,
                        projectStatus === status && styles.radioLabelActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Do you have more than one project?</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !multipleProjects && styles.toggleButtonActive,
                  ]}
                  onPress={() => setMultipleProjects(false)}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      !multipleProjects && styles.toggleButtonTextActive,
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    multipleProjects && styles.toggleButtonActive,
                  ]}
                  onPress={() => setMultipleProjects(true)}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      multipleProjects && styles.toggleButtonTextActive,
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
              {multipleProjects && (
                <Text style={styles.helperText}>
                  This profile focuses on one project for now. We&apos;ll add multi-project support
                  soon.
                </Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Known or Likely Developer</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Meta, Google, AWS, QTS"
                placeholderTextColor="#9CA3AF"
                value={developer}
                onChangeText={setDeveloper}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>LLC or Project Codename (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Liames LLC / Project Accordion"
                placeholderTextColor="#9CA3AF"
                value={llcOrCodename}
                onChangeText={setLlcOrCodename}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Zoning (if known)</Text>
              <View style={styles.optionsRow}>
                {[
                  "Don't know",
                  'Agricultural',
                  'Residential',
                  'Commercial',
                  'Industrial',
                  'Special district',
                ].map((zone) => (
                  <TouchableOpacity
                    key={zone}
                    style={[
                      styles.optionButton,
                      zoning === zone && styles.optionButtonActive,
                    ]}
                    onPress={() => setZoning(zone)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        zoning === zone && styles.optionButtonTextActive,
                      ]}
                    >
                      {zone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Key Decision-Makers (select all that apply)</Text>
              <View style={styles.checkboxGroup}>
                {[
                  'County commission',
                  'City council',
                  'Township board',
                  'Planning commission',
                  'Utility commission',
                ].map((maker) => (
                  <TouchableOpacity
                    key={maker}
                    style={styles.checkboxRow}
                    onPress={() => toggleDecisionMaker(maker)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        decisionMakers.includes(maker) && styles.checkboxActive,
                      ]}
                    >
                      {decisionMakers.includes(maker) && (
                        <CheckCircle size={16} color="#F59E0B" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{maker}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>How organized is your community? *</Text>
              <View style={styles.radioGroup}>
                {[
                  { value: 'Just starting', label: 'Just getting started' },
                  { value: 'Some organizing', label: 'Some active organizers' },
                  { value: 'Strong coalition', label: 'Strong coalition' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.radioButton,
                      organizingStrength === option.value && styles.radioButtonActive,
                    ]}
                    onPress={() =>
                      setOrganizingStrength(option.value as OrganizingLevel)
                    }
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        organizingStrength === option.value && styles.radioCircleActive,
                      ]}
                    >
                      {organizingStrength === option.value && (
                        <View style={styles.radioCircleFill} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioLabel,
                        organizingStrength === option.value && styles.radioLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                profileSaved && styles.saveButtonSuccess,
              ]}
              onPress={handleSaveProfile}
            >
              {profileSaved ? (
                <>
                  <CheckCircle size={20} color="white" />
                  <Text style={styles.saveButtonText}>Profile Saved!</Text>
                </>
              ) : (
                <Text style={styles.saveButtonText}>Save / Update Profile</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.helperText}>
              This helps BEACON connect you with communities facing similar projects.
            </Text>
              </View>

              {filteredCommunitiesForSearch.length > 0 && (
            <View style={styles.matchedCard}>
              <View style={styles.cardHeader}>
                <Building2 size={24} color="#F59E0B" />
                <Text style={styles.cardTitle}>Communities Like Yours</Text>
              </View>
              <Text style={styles.cardDescription}>
                These communities are facing similar projects. Connect with them to share
                strategies.
              </Text>

              <View style={styles.filtersRow}>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Developer:</Text>
                  <View style={styles.filterButtons}>
                    {['All', 'Meta', 'Google', 'AWS'].map((dev) => (
                      <TouchableOpacity
                        key={dev}
                        style={[
                          styles.filterButton,
                          filterDeveloper === dev && styles.filterButtonActive,
                        ]}
                        onPress={() => setFilterDeveloper(dev)}
                      >
                        <Text
                          style={[
                            styles.filterButtonText,
                            filterDeveloper === dev && styles.filterButtonTextActive,
                          ]}
                        >
                          {dev}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Status:</Text>
                  <View style={styles.filterButtons}>
                    {['All', 'Proposed', 'Planning / permitting', 'Operating'].map((stat) => (
                      <TouchableOpacity
                        key={stat}
                        style={[
                          styles.filterButton,
                          filterStatus === stat && styles.filterButtonActive,
                        ]}
                        onPress={() => setFilterStatus(stat)}
                      >
                        <Text
                          style={[
                            styles.filterButtonText,
                            filterStatus === stat && styles.filterButtonTextActive,
                          ]}
                        >
                          {stat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.communitiesList}>
                {filteredCommunitiesForSearch.map((community) => (
                  <View key={community.id} style={styles.communityCard}>
                    <View style={styles.communityHeader}>
                      <Text style={styles.communityName}>
                        {community.name}, {community.state}
                      </Text>
                      <Shield
                        size={20}
                        color={
                          community.organizingLevel === 'Strong coalition'
                            ? '#10B981'
                            : community.organizingLevel === 'Some organizing'
                            ? '#F59E0B'
                            : '#9CA3AF'
                        }
                      />
                    </View>

                    <View style={styles.communityTags}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{community.developer}</Text>
                      </View>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{community.projectStatus}</Text>
                      </View>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{community.organizingLevel}</Text>
                      </View>
                    </View>

                    <Text style={styles.communityDescription}>
                      {community.description}
                    </Text>

                    <TouchableOpacity
                      style={styles.viewChannelButton}
                      onPress={() => handleViewChannel(community.id)}
                    >
                      <MessageCircle size={16} color="#1E3A5F" />
                      <Text style={styles.viewChannelButtonText}>View channel</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text style={styles.helperText}>
                These are sample communities. In the future, this will be populated by real
                groups using the platform.
              </Text>
              </View>
              )}
            </>
          )}

          {activeTab === 'conversation' && (
            <>
              <View style={styles.createChannelCard}>
                <View style={styles.cardHeader}>
                  <Plus size={24} color="#F59E0B" />
                  <Text style={styles.cardTitle}>Start a New Conversation</Text>
                </View>
                <Text style={styles.cardDescription}>
                  Create a new channel to discuss a topic, coordinate organizing, or ask questions.
                </Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Channel / Topic Title *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Water Use Questions - Nebraska"
                    placeholderTextColor="#9CA3AF"
                    value={newChannelTitle}
                    onChangeText={setNewChannelTitle}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Brief description of this channel"
                    placeholderTextColor="#9CA3AF"
                    value={newChannelDescription}
                    onChangeText={setNewChannelDescription}
                  />
                </View>

                <View style={styles.formGroup}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setLinkToProfile(!linkToProfile)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        linkToProfile && styles.checkboxActive,
                      ]}
                    >
                      {linkToProfile && (
                        <CheckCircle size={16} color="#F59E0B" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>Link to my community profile</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>First Message / Question (optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Start the conversation with a message or question..."
                    placeholderTextColor="#9CA3AF"
                    value={newChannelFirstMessage}
                    onChangeText={setNewChannelFirstMessage}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <TouchableOpacity
                  style={styles.createChannelButton}
                  onPress={handleCreateChannel}
                  disabled={!newChannelTitle.trim()}
                >
                  <Plus size={20} color="white" />
                  <Text style={styles.createChannelButtonText}>Create Channel</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.conversationsCard}>
                <View style={styles.cardHeader}>
                  <MessageCircle size={24} color="#F59E0B" />
                  <Text style={styles.cardTitle}>All Channels</Text>
                </View>

                <View style={styles.conversationsLayout}>
                  <View style={styles.channelsList}>
                    <Text style={styles.channelsTitle}>Channels</Text>
                    {filteredChannelsForSearch.map((channel) => (
                      <TouchableOpacity
                        key={channel.id}
                        style={[
                          styles.channelItem,
                          selectedChannel === channel.id && styles.channelItemActive,
                        ]}
                        onPress={() => setSelectedChannel(channel.id)}
                      >
                        <Text
                          style={[
                            styles.channelName,
                            selectedChannel === channel.id && styles.channelNameActive,
                          ]}
                        >
                          {channel.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.messagesPanel}>
                    <View style={styles.messagesPanelHeader}>
                      <Text style={styles.messagesPanelTitle}>
                        {filteredChannelsForSearch.find((ch) => ch.id === selectedChannel)?.name}
                      </Text>
                      <Text style={styles.messagesPanelDescription}>
                        {filteredChannelsForSearch.find((ch) => ch.id === selectedChannel)?.description}
                      </Text>
                    </View>

                    <ScrollView style={styles.messagesScroll}>
                      {messages.filter((m) => m.channelId === selectedChannel).map((message) => (
                        <View key={message.id} style={styles.messageItem}>
                          <View style={styles.messageHeader}>
                            <Text style={styles.messageAuthor}>{message.author}</Text>
                            <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
                          </View>
                          <Text style={styles.messageText}>{message.text}</Text>
                        </View>
                      ))}
                    </ScrollView>

                    <View style={styles.messageInput}>
                      <TextInput
                        style={styles.messageTextInput}
                        placeholder="Type your message..."
                        placeholderTextColor="#9CA3AF"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                      />
                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handlePostMessage}
                      >
                        <Send size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

          {activeTab === 'forums' && (
            <View style={styles.forumsCard}>
              <View style={styles.cardHeader}>
                <MessagesSquare size={24} color="#F59E0B" />
                <Text style={styles.cardTitle}>Community Forums</Text>
              </View>
              <Text style={styles.cardDescription}>
                Explore conversations organized by theme. Click on a topic to see related channels and threads.
              </Text>

              <View style={styles.forumTopicsList}>
                {forumTopics.map((topic) => (
                  <View key={topic.id} style={styles.forumTopicCard}>
                    <View style={styles.forumTopicHeader}>
                      <Text style={styles.forumTopicTitle}>{topic.title}</Text>
                      <View style={styles.forumTopicBadge}>
                        <Text style={styles.forumTopicBadgeText}>
                          {topic.channels.length} channels
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.forumTopicDescription}>{topic.description}</Text>

                    {topic.channels.length > 0 ? (
                      <View style={styles.forumChannelsList}>
                        {topic.channels.slice(0, 3).map((channel) => (
                          <TouchableOpacity
                            key={channel.id}
                            style={styles.forumChannelItem}
                            onPress={() => {
                              setSelectedChannel(channel.id);
                              setActiveTab('conversation');
                            }}
                          >
                            <MessageCircle size={16} color="#6B7280" />
                            <Text style={styles.forumChannelName}>{channel.name}</Text>
                          </TouchableOpacity>
                        ))}
                        {topic.channels.length > 3 && (
                          <Text style={styles.forumChannelsMore}>
                            +{topic.channels.length - 3} more channels
                          </Text>
                        )}
                      </View>
                    ) : (
                      <Text style={styles.noChannelsText}>No channels yet for this topic</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: '#1E3A5F',
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 16,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: '#F59E0B',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#E5E7EB',
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 26,
  },
  heroNote: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionBar: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 16,
    ...Platform.select({
      web: {
        position: 'sticky' as const,
        top: 0,
        zIndex: 10,
      },
      default: {},
    }),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  actionButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  actionButtonTextActive: {
    color: '#92400E',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 48,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 24,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1E3A5F',
  },
  cardDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  statePickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  stateScroll: {
    maxHeight: 120,
  },
  stateScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  stateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
    marginBottom: 6,
  },
  stateChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  stateChipText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  stateChipTextActive: {
    color: '#92400E',
    fontWeight: '600' as const,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  optionButtonTextActive: {
    color: '#92400E',
  },
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  radioButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioCircleActive: {
    borderColor: '#F59E0B',
  },
  radioCircleFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  radioLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500' as const,
    flex: 1,
  },
  radioLabelActive: {
    color: '#92400E',
    fontWeight: '600' as const,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#92400E',
  },
  checkboxGroup: {
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500' as const,
  },
  saveButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  saveButtonSuccess: {
    backgroundColor: '#10B981',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  matchedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  filtersRow: {
    gap: 16,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#92400E',
  },
  communitiesList: {
    gap: 16,
  },
  communityCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1E3A5F',
    flex: 1,
  },
  communityTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#4B5563',
  },
  communityDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  viewChannelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
    alignSelf: 'flex-start',
  },
  viewChannelButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#1E3A5F',
  },
  conversationsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  conversationsLayout: {
    ...Platform.select({
      web: {
        flexDirection: 'row' as const,
        gap: 20,
        minHeight: 500,
      },
      default: {
        gap: 20,
      },
    }),
  },
  channelsList: {
    ...Platform.select({
      web: {
        width: 280,
        flexShrink: 0,
      },
      default: {
        gap: 8,
      },
    }),
    gap: 8,
  },
  channelsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1E3A5F',
    marginBottom: 8,
  },
  channelItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  channelItemActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  channelName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  channelNameActive: {
    color: '#92400E',
  },
  messagesPanel: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      web: {
        minHeight: 500,
      },
      default: {
        height: 500,
      },
    }),
  },
  messagesPanelHeader: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  messagesPanelTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1E3A5F',
    marginBottom: 4,
  },
  messagesPanelDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  messagesScroll: {
    flex: 1,
    padding: 16,
  },
  messageItem: {
    marginBottom: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageAuthor: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#1E3A5F',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  messageInput: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
    alignItems: 'flex-end',
  },
  messageTextInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#F59E0B',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createChannelCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createChannelButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  createChannelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  forumsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  forumTopicsList: {
    gap: 16,
  },
  forumTopicCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  forumTopicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  forumTopicTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1E3A5F',
    flex: 1,
  },
  forumTopicBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  forumTopicBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#92400E',
  },
  forumTopicDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  forumChannelsList: {
    gap: 8,
    marginTop: 8,
  },
  forumChannelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  forumChannelName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    flex: 1,
  },
  forumChannelsMore: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingLeft: 14,
  },
  noChannelsText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
