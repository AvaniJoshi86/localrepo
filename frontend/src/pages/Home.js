import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  Microscope, 
  Brain, 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.background.primary} 100%);
  padding: ${({ theme }) => theme.spacing[20]} 0 ${({ theme }) => theme.spacing[16]};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 40%;
    height: 200%;
    background: linear-gradient(45deg, ${({ theme }) => theme.colors.primary[100]}30, transparent);
    border-radius: 50%;
    transform: rotate(15deg);
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[800]});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const CTAContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    text-decoration: none;
    color: white;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  background: white;
  color: ${({ theme }) => theme.colors.primary[600]};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const TrustIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[8]};
  flex-wrap: wrap;
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[16]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

const FeatureCard = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
  transition: transform ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[100]}, ${({ theme }) => theme.colors.primary[200]});
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const StatsSection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[700]});
  color: white;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

const StatItem = styled.div`
  h3 {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: white;
  }

  p {
    color: ${({ theme }) => theme.colors.primary[100]};
    margin-bottom: 0;
  }
`;

const features = [
  {
    icon: <Microscope size={32} />,
    title: 'Smart Skin Analysis',
    description: '5-minute interactive assessment with AI-powered photo analysis to identify your unique skin concerns and type.'
  },
  {
    icon: <Brain size={32} />,
    title: 'Ingredient Intelligence',
    description: 'Real-time ingredient decoder with interaction checker and plain English explanations of complex formulations.'
  },
  {
    icon: <Heart size={32} />,
    title: 'Personalized Routines',
    description: 'Custom skincare routines built for your skin type, concerns, lifestyle, and budget preferences.'
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Safety First',
    description: 'Dermatologist-approved recommendations with patch test guidance and ingredient safety ratings.'
  },
  {
    icon: <TrendingUp size={32} />,
    title: 'Progress Tracking',
    description: 'Monitor your skin improvement with photo comparisons and objective metrics over time.'
  },
  {
    icon: <Star size={32} />,
    title: 'Smart Sampling',
    description: 'Try before you buy with curated sample boxes and risk-free trial periods.'
  }
];

const Home = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Your Personal Skincare Expert
          </HeroTitle>
          <HeroSubtitle>
            End the confusion, overwhelm, and trial-and-error frustration. 
            SkinWise uses AI-powered analysis to build the perfect skincare routine for your unique skin.
          </HeroSubtitle>
          
          <CTAContainer>
            <PrimaryButton to="/skin-analysis">
              Start Free Analysis
              <ArrowRight size={20} />
            </PrimaryButton>
            <SecondaryButton to="/products">
              Browse Products
            </SecondaryButton>
          </CTAContainer>

          <TrustIndicators>
            <TrustBadge>
              <CheckCircle size={16} />
              Dermatologist Approved
            </TrustBadge>
            <TrustBadge>
              <CheckCircle size={16} />
              50,000+ Happy Users
            </TrustBadge>
            <TrustBadge>
              <CheckCircle size={16} />
              Science-Based
            </TrustBadge>
          </TrustIndicators>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <div className="container">
          <SectionTitle>
            Why Choose SkinWise?
          </SectionTitle>
          <SectionSubtitle>
            We solve the core problems that make skincare shopping overwhelming and frustrating
          </SectionSubtitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <StatsSection>
        <div className="container">
          <SectionTitle style={{ color: 'white', marginBottom: '3rem' }}>
            Trusted by Thousands
          </SectionTitle>
          
          <StatsGrid>
            <StatItem>
              <h3>50,000+</h3>
              <p>Users Trust SkinWise</p>
            </StatItem>
            <StatItem>
              <h3>94%</h3>
              <p>See Improvement in 30 Days</p>
            </StatItem>
            <StatItem>
              <h3>500+</h3>
              <p>Dermatologist-Approved Products</p>
            </StatItem>
            <StatItem>
              <h3>4.9/5</h3>
              <p>Average User Rating</p>
            </StatItem>
          </StatsGrid>
        </div>
      </StatsSection>
    </HomeContainer>
  );
};

export default Home;