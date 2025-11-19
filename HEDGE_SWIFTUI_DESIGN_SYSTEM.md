# Hedge Payments SwiftUI Design System
## Complete Implementation Guide for iOS App

---

## 📁 File Structure

```
YourApp/
├── DesignSystem/
│   ├── HedgeColors.swift
│   ├── HedgeTypography.swift
│   ├── HedgeSpacing.swift
│   ├── HedgeAnimations.swift
│   └── HedgeComponents.swift
├── Views/
│   └── Examples/
│       ├── DashboardView.swift
│       └── PaymentCardView.swift
└── Extensions/
    └── View+Extensions.swift
```

---

## 🎨 HedgeColors.swift

```swift
import SwiftUI

extension Color {
    // MARK: - Backgrounds
    static let hedgeCream = Color(hex: "FAF8F5")
    static let hedgeWhite = Color(hex: "FFFFFF")
    
    // MARK: - Text Colors
    static let hedgeDarkBrown = Color(hex: "2C2416")
    static let hedgeMediumBrown = Color(hex: "6B5D4F")
    static let hedgeLightBrown = Color(hex: "8B7E6E")
    
    // MARK: - Borders & Dividers
    static let hedgeTan = Color(hex: "D4C5B0")
    static let hedgeDarkBorder = Color(hex: "3D3024")
    
    // MARK: - Accent Colors
    static let hedgeSuccessGreen = Color(hex: "4CAF50")
    static let hedgeSuccessBg = Color(hex: "E8F5E9")
    static let hedgeWarningOrange = Color(hex: "F59E0B")
    static let hedgeWarningBg = Color(hex: "FFF4E6")
}

// MARK: - Hex Initializer
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
```

---

## 📝 HedgeTypography.swift

```swift
import SwiftUI

extension Font {
    // MARK: - Display & Titles
    static let hedgeDisplay = Font.custom("NewYorkLarge-Regular", size: 64)
        .weight(.regular)
    
    static let hedgeLargeTitle = Font.custom("NewYorkLarge-Regular", size: 48)
        .weight(.regular)
    
    static let hedgeTitle = Font.custom("NewYorkLarge-Semibold", size: 34)
        .weight(.semibold)
    
    static let hedgeHeadline = Font.custom("NewYorkMedium-Semibold", size: 24)
        .weight(.semibold)
    
    static let hedgeSubheadline = Font.custom("NewYorkMedium-Regular", size: 20)
        .weight(.regular)
    
    // MARK: - Body Text
    static let hedgeBody = Font.custom("NewYorkMedium-Regular", size: 17)
        .weight(.regular)
    
    static let hedgeBodyItalic = Font.custom("NewYorkMedium-RegularItalic", size: 17)
        .weight(.regular)
        .italic()
    
    // MARK: - Small Text
    static let hedgeCaption = Font.custom("NewYorkSmall-Regular", size: 12)
        .weight(.regular)
    
    static let hedgeLabel = Font.custom("NewYorkSmall-Medium", size: 11)
        .weight(.medium)
}

// MARK: - Text Styles (for easier use)
struct HedgeTextStyle {
    static func display(_ text: String) -> some View {
        Text(text)
            .font(.hedgeDisplay)
            .foregroundColor(.hedgeDarkBrown)
            .tracking(-1.28) // -2% letter spacing
    }
    
    static func largeTitle(_ text: String) -> some View {
        Text(text)
            .font(.hedgeLargeTitle)
            .foregroundColor(.hedgeDarkBrown)
            .tracking(-0.96) // -2% letter spacing
    }
    
    static func title(_ text: String) -> some View {
        Text(text)
            .font(.hedgeTitle)
            .foregroundColor(.hedgeDarkBrown)
    }
    
    static func headline(_ text: String) -> some View {
        Text(text)
            .font(.hedgeHeadline)
            .foregroundColor(.hedgeDarkBrown)
    }
    
    static func subheadline(_ text: String) -> some View {
        Text(text)
            .font(.hedgeSubheadline)
            .foregroundColor(.hedgeDarkBrown)
    }
    
    static func body(_ text: String) -> some View {
        Text(text)
            .font(.hedgeBody)
            .foregroundColor(.hedgeDarkBrown)
    }
    
    static func bodyItalic(_ text: String) -> some View {
        Text(text)
            .font(.hedgeBodyItalic)
            .foregroundColor(.hedgeMediumBrown)
    }
    
    static func caption(_ text: String) -> some View {
        Text(text)
            .font(.hedgeCaption)
            .foregroundColor(.hedgeMediumBrown)
    }
    
    static func label(_ text: String) -> some View {
        Text(text.uppercased())
            .font(.hedgeLabel)
            .foregroundColor(.hedgeLightBrown)
            .tracking(1.1) // +10% letter spacing
    }
}
```

---

## 📐 HedgeSpacing.swift

```swift
import SwiftUI

extension CGFloat {
    // MARK: - Spacing Scale (multiples of 4)
    static let spaceXS: CGFloat = 4
    static let spaceS: CGFloat = 8
    static let spaceM: CGFloat = 12
    static let spaceL: CGFloat = 16
    static let spaceXL: CGFloat = 24
    static let space2XL: CGFloat = 32
    static let space3XL: CGFloat = 48
    static let space4XL: CGFloat = 64
    
    // MARK: - Common Use Cases
    static let cardPadding: CGFloat = 24
    static let screenPadding: CGFloat = 24
    static let sectionSpacing: CGFloat = 48
    static let fieldSpacing: CGFloat = 16
    static let groupSpacing: CGFloat = 12
}

// MARK: - Edge Insets
extension EdgeInsets {
    static let hedgeCard = EdgeInsets(top: 24, leading: 24, bottom: 24, trailing: 24)
    static let hedgeScreen = EdgeInsets(top: 24, leading: 24, bottom: 24, trailing: 24)
    static let hedgeButton = EdgeInsets(top: 16, leading: 40, bottom: 16, trailing: 40)
    static let hedgeTextField = EdgeInsets(top: 16, leading: 16, bottom: 16, trailing: 16)
}
```

---

## 🎭 HedgeAnimations.swift

```swift
import SwiftUI

struct HedgeAnimation {
    // MARK: - Duration Constants
    static let fast: Double = 0.15
    static let medium: Double = 0.3
    static let slow: Double = 0.6
    static let verySlow: Double = 0.8
    
    // MARK: - Predefined Animations
    static let fadeIn = Animation.easeOut(duration: verySlow)
    static let buttonPress = Animation.easeOut(duration: fast)
    static let hover = Animation.spring(response: 0.4, dampingFraction: 0.8)
    static let pageTransition = Animation.easeOut(duration: slow)
    
    // MARK: - Staggered Animation Helper
    static func staggeredDelay(index: Int, baseDelay: Double = 0.2) -> Double {
        return Double(index) * baseDelay
    }
}

// MARK: - View Modifiers for Common Animations
extension View {
    func hedgeFadeIn(delay: Double = 0) -> some View {
        self.modifier(HedgeFadeInModifier(delay: delay))
    }
    
    func hedgeButtonPress() -> some View {
        self.modifier(HedgeButtonPressModifier())
    }
}

// MARK: - Fade In Modifier
struct HedgeFadeInModifier: ViewModifier {
    let delay: Double
    @State private var isVisible = false
    
    func body(content: Content) -> some View {
        content
            .opacity(isVisible ? 1 : 0)
            .offset(y: isVisible ? 0 : 20)
            .onAppear {
                withAnimation(HedgeAnimation.fadeIn.delay(delay)) {
                    isVisible = true
                }
            }
    }
}

// MARK: - Button Press Modifier
struct HedgeButtonPressModifier: ViewModifier {
    @State private var isPressed = false
    
    func body(content: Content) -> some View {
        content
            .scaleEffect(isPressed ? 0.97 : 1.0)
            .onLongPressGesture(minimumDuration: .infinity, maximumDistance: .infinity, pressing: { pressing in
                withAnimation(HedgeAnimation.buttonPress) {
                    isPressed = pressing
                }
            }, perform: { })
    }
}
```

---

## 🧩 HedgeComponents.swift

```swift
import SwiftUI

// MARK: - Hedge Card
struct HedgeCard<Content: View>: View {
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        content
            .padding(.hedgeCard)
            .background(Color.hedgeWhite)
            .overlay(
                Rectangle()
                    .stroke(Color.hedgeTan, lineWidth: 1)
            )
            .shadow(color: Color.hedgeDarkBrown.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Primary Button
struct HedgePrimaryButton: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.hedgeBody)
                .foregroundColor(.hedgeCream)
                .padding(.hedgeButton)
                .frame(maxWidth: .infinity)
                .background(Color.hedgeDarkBrown)
                .overlay(
                    Rectangle()
                        .stroke(Color.hedgeDarkBrown, lineWidth: 1)
                )
        }
        .hedgeButtonPress()
    }
}

// MARK: - Secondary Button
struct HedgeSecondaryButton: View {
    let title: String
    let action: () -> Void
    @State private var isHovered = false
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.hedgeBody)
                .foregroundColor(.hedgeDarkBrown)
                .padding(.hedgeButton)
                .frame(maxWidth: .infinity)
                .background(Color.clear)
                .overlay(
                    Rectangle()
                        .stroke(isHovered ? Color.hedgeDarkBrown : Color.hedgeTan, lineWidth: 1)
                )
        }
        .hedgeButtonPress()
        .onHover { hovering in
            withAnimation(HedgeAnimation.hover) {
                isHovered = hovering
            }
        }
    }
}

// MARK: - Text Field
struct HedgeTextField: View {
    let placeholder: String
    @Binding var text: String
    @FocusState private var isFocused: Bool
    
    var body: some View {
        TextField(placeholder, text: $text)
            .font(.hedgeBody)
            .foregroundColor(.hedgeDarkBrown)
            .padding(.hedgeTextField)
            .background(Color.hedgeCream)
            .overlay(
                Rectangle()
                    .stroke(isFocused ? Color.hedgeDarkBrown : Color.hedgeTan, lineWidth: 1)
            )
            .focused($isFocused)
    }
}

// MARK: - Badge/Tag
struct HedgeBadge: View {
    let text: String
    let style: BadgeStyle
    
    enum BadgeStyle {
        case primary
        case success
        case warning
        
        var backgroundColor: Color {
            switch self {
            case .primary: return .hedgeDarkBrown
            case .success: return .hedgeSuccessGreen
            case .warning: return .hedgeWarningOrange
            }
        }
        
        var textColor: Color {
            return .hedgeCream
        }
    }
    
    var body: some View {
        Text(text.uppercased())
            .font(.hedgeCaption)
            .foregroundColor(style.textColor)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(style.backgroundColor)
    }
}

// MARK: - Divider
struct HedgeDivider: View {
    var body: some View {
        Rectangle()
            .fill(Color.hedgeTan)
            .frame(height: 1)
    }
}

// MARK: - Alert/Callout Box
struct HedgeCallout: View {
    let title: String
    let message: String
    let style: CalloutStyle
    
    enum CalloutStyle {
        case success
        case warning
        
        var backgroundColor: Color {
            switch self {
            case .success: return .hedgeSuccessBg
            case .warning: return .hedgeWarningBg
            }
        }
        
        var borderColor: Color {
            switch self {
            case .success: return .hedgeSuccessGreen
            case .warning: return .hedgeWarningOrange
            }
        }
        
        var icon: String {
            switch self {
            case .success: return "✅"
            case .warning: return "⚠️"
            }
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: .spaceS) {
            HStack {
                Text(style.icon)
                Text(title)
                    .font(.hedgeBody)
                    .fontWeight(.semibold)
                    .foregroundColor(.hedgeDarkBrown)
            }
            
            Text(message)
                .font(.hedgeBody)
                .foregroundColor(.hedgeDarkBrown)
        }
        .padding(.hedgeCard)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(style.backgroundColor)
        .overlay(
            Rectangle()
                .stroke(style.borderColor, lineWidth: 1)
        )
    }
}

// MARK: - Stat Card
struct HedgeStatCard: View {
    let label: String
    let value: String
    let subtitle: String?
    
    init(label: String, value: String, subtitle: String? = nil) {
        self.label = label
        self.value = value
        self.subtitle = subtitle
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: .spaceS) {
            Text(label.uppercased())
                .font(.hedgeLabel)
                .foregroundColor(.hedgeLightBrown)
                .tracking(1.1)
            
            Text(value)
                .font(.system(size: 32, weight: .medium, design: .serif))
                .foregroundColor(.hedgeDarkBrown)
            
            if let subtitle = subtitle {
                Text(subtitle)
                    .font(.hedgeCaption)
                    .foregroundColor(.hedgeMediumBrown)
            }
        }
        .padding(.cardPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.hedgeWhite)
        .overlay(
            Rectangle()
                .stroke(Color.hedgeTan, lineWidth: 1)
        )
    }
}

// MARK: - Progress Bar
struct HedgeProgressBar: View {
    let progress: Double // 0.0 to 1.0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                Rectangle()
                    .fill(Color.hedgeCream)
                    .frame(height: 8)
                
                Rectangle()
                    .fill(Color.hedgeDarkBrown)
                    .frame(width: geometry.size.width * progress, height: 8)
            }
        }
        .frame(height: 8)
    }
}

// MARK: - Onboarding Checklist Item
struct HedgeChecklistItem: View {
    let title: String
    let isCompleted: Bool
    
    var body: some View {
        HStack(spacing: .spaceM) {
            ZStack {
                Rectangle()
                    .stroke(isCompleted ? Color.hedgeDarkBrown : Color.hedgeTan, lineWidth: 2)
                    .frame(width: 24, height: 24)
                
                if isCompleted {
                    Rectangle()
                        .fill(Color.hedgeDarkBrown)
                        .frame(width: 24, height: 24)
                    
                    Text("✓")
                        .font(.system(size: 12))
                        .foregroundColor(.hedgeCream)
                }
            }
            
            Text(title)
                .font(.hedgeBody)
                .foregroundColor(isCompleted ? .hedgeDarkBrown : .hedgeLightBrown)
        }
    }
}
```

---

## 📱 Example Views

### DashboardView.swift

```swift
import SwiftUI

struct DashboardView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: .space3XL) {
                // Header
                VStack(alignment: .leading, spacing: .spaceM) {
                    HedgeTextStyle.title("Dashboard")
                    HedgeTextStyle.bodyItalic("Track your payment activity")
                }
                .padding(.horizontal, .screenPadding)
                .hedgeFadeIn()
                
                // Stats Grid
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: .spaceL) {
                    HedgeStatCard(
                        label: "Total Volume",
                        value: "$1.25M",
                        subtitle: "+15% this month"
                    )
                    .hedgeFadeIn(delay: 0.2)
                    
                    HedgeStatCard(
                        label: "Transactions",
                        value: "1,543",
                        subtitle: "127 today"
                    )
                    .hedgeFadeIn(delay: 0.3)
                    
                    HedgeStatCard(
                        label: "Success Rate",
                        value: "99.2%",
                        subtitle: "Last 7 days"
                    )
                    .hedgeFadeIn(delay: 0.4)
                    
                    HedgeStatCard(
                        label: "Active Users",
                        value: "432",
                        subtitle: "+12 this week"
                    )
                    .hedgeFadeIn(delay: 0.5)
                }
                .padding(.horizontal, .screenPadding)
                
                // AI Integration Callout
                HedgeCallout(
                    title: "Built for AI",
                    message: "Hedge Payments works seamlessly with Claude, Claude Code, ChatGPT, Codex, and all major AI platforms.",
                    style: .success
                )
                .padding(.horizontal, .screenPadding)
                .hedgeFadeIn(delay: 0.6)
                
                // Recent Activity
                VStack(alignment: .leading, spacing: .spaceL) {
                    HedgeTextStyle.headline("Recent Activity")
                    
                    HedgeCard {
                        VStack(alignment: .leading, spacing: .spaceL) {
                            ActivityRow(
                                title: "Payment completed",
                                subtitle: "$250.00 • user@example.com",
                                timestamp: "2 minutes ago"
                            )
                            
                            HedgeDivider()
                            
                            ActivityRow(
                                title: "New user signup",
                                subtitle: "dev@startup.com",
                                timestamp: "15 minutes ago"
                            )
                            
                            HedgeDivider()
                            
                            ActivityRow(
                                title: "API key generated",
                                subtitle: "Test mode",
                                timestamp: "1 hour ago"
                            )
                        }
                    }
                }
                .padding(.horizontal, .screenPadding)
                .hedgeFadeIn(delay: 0.7)
            }
            .padding(.vertical, .space3XL)
        }
        .background(Color.hedgeCream)
    }
}

// MARK: - Supporting Views
struct ActivityRow: View {
    let title: String
    let subtitle: String
    let timestamp: String
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: .spaceXS) {
                Text(title)
                    .font(.hedgeBody)
                    .foregroundColor(.hedgeDarkBrown)
                
                Text(subtitle)
                    .font(.hedgeCaption)
                    .foregroundColor(.hedgeMediumBrown)
            }
            
            Spacer()
            
            Text(timestamp)
                .font(.hedgeCaption)
                .foregroundColor(.hedgeLightBrown)
        }
    }
}

// MARK: - Preview
struct DashboardView_Previews: PreviewProvider {
    static var previews: some View {
        DashboardView()
    }
}
```

---

### PaymentFormView.swift

```swift
import SwiftUI

struct PaymentFormView: View {
    @State private var amount: String = ""
    @State private var email: String = ""
    @State private var description: String = ""
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: .space3XL) {
                // Header
                VStack(alignment: .leading, spacing: .spaceM) {
                    HedgeTextStyle.title("Create Payment")
                    HedgeTextStyle.bodyItalic("Accept crypto and fiat payments")
                }
                .hedgeFadeIn()
                
                // Form Card
                HedgeCard {
                    VStack(alignment: .leading, spacing: .fieldSpacing) {
                        // Amount Field
                        VStack(alignment: .leading, spacing: .spaceS) {
                            HedgeTextStyle.label("Amount (USD)")
                            HedgeTextField(placeholder: "100.00", text: $amount)
                                .keyboardType(.decimalPad)
                        }
                        
                        // Email Field
                        VStack(alignment: .leading, spacing: .spaceS) {
                            HedgeTextStyle.label("Customer Email")
                            HedgeTextField(placeholder: "user@example.com", text: $email)
                                .keyboardType(.emailAddress)
                                .textInputAutocapitalization(.never)
                        }
                        
                        // Description Field
                        VStack(alignment: .leading, spacing: .spaceS) {
                            HedgeTextStyle.label("Description")
                            HedgeTextField(placeholder: "Premium subscription", text: $description)
                        }
                    }
                }
                .hedgeFadeIn(delay: 0.2)
                
                // Supported Currencies
                HedgeCard {
                    VStack(alignment: .leading, spacing: .spaceL) {
                        HedgeTextStyle.headline("Supported Currencies")
                        
                        HStack(spacing: .spaceL) {
                            VStack(alignment: .leading, spacing: .spaceS) {
                                Text("🪙")
                                    .font(.system(size: 24))
                                Text("Crypto")
                                    .font(.hedgeBody)
                                    .foregroundColor(.hedgeDarkBrown)
                                Text("BTC, ETH, USDC, SOL")
                                    .font(.hedgeCaption)
                                    .foregroundColor(.hedgeMediumBrown)
                            }
                            
                            Spacer()
                            
                            VStack(alignment: .leading, spacing: .spaceS) {
                                Text("💵")
                                    .font(.system(size: 24))
                                Text("Fiat")
                                    .font(.hedgeBody)
                                    .foregroundColor(.hedgeDarkBrown)
                                Text("USD, EUR, GBP")
                                    .font(.hedgeCaption)
                                    .foregroundColor(.hedgeMediumBrown)
                            }
                        }
                    }
                }
                .hedgeFadeIn(delay: 0.3)
                
                // Buttons
                VStack(spacing: .spaceL) {
                    HedgePrimaryButton(title: "Create Payment") {
                        // Handle payment creation
                    }
                    
                    HedgeSecondaryButton(title: "View Documentation") {
                        // Navigate to docs
                    }
                }
                .hedgeFadeIn(delay: 0.4)
            }
            .padding(.screenPadding)
            .padding(.vertical, .space3XL)
        }
        .background(Color.hedgeCream)
    }
}

struct PaymentFormView_Previews: PreviewProvider {
    static var previews: some View {
        PaymentFormView()
    }
}
```

---

### OnboardingProgressView.swift

```swift
import SwiftUI

struct OnboardingProgressView: View {
    let steps = [
        ("Signed Up", true),
        ("Email Verified", true),
        ("Generated API Key", true),
        ("First API Call", true),
        ("First Payment", false),
        ("Webhook Configured", false),
        ("Went Live", false)
    ]
    
    var completedCount: Int {
        steps.filter { $0.1 }.count
    }
    
    var progress: Double {
        Double(completedCount) / Double(steps.count)
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: .space3XL) {
                // Header
                VStack(alignment: .leading, spacing: .spaceM) {
                    HedgeTextStyle.title("Onboarding")
                    HedgeTextStyle.bodyItalic("Complete your integration")
                }
                .hedgeFadeIn()
                
                // Progress Card
                HedgeCard {
                    VStack(alignment: .leading, spacing: .spaceL) {
                        HStack {
                            HedgeTextStyle.headline("Progress")
                            Spacer()
                            Text("\(completedCount)/\(steps.count)")
                                .font(.hedgeBody)
                                .foregroundColor(.hedgeMediumBrown)
                        }
                        
                        HedgeProgressBar(progress: progress)
                        
                        Text("\(Int(progress * 100))% complete")
                            .font(.hedgeCaption)
                            .foregroundColor(.hedgeMediumBrown)
                    }
                }
                .hedgeFadeIn(delay: 0.2)
                
                // Checklist
                HedgeCard {
                    VStack(alignment: .leading, spacing: .fieldSpacing) {
                        ForEach(Array(steps.enumerated()), id: \.offset) { index, step in
                            HedgeChecklistItem(
                                title: step.0,
                                isCompleted: step.1
                            )
                            .hedgeFadeIn(delay: 0.3 + Double(index) * 0.1)
                            
                            if index < steps.count - 1 {
                                HedgeDivider()
                            }
                        }
                    }
                }
                
                // Next Steps
                if !steps.allSatisfy({ $0.1 }) {
                    HedgeCallout(
                        title: "Next Step",
                        message: "Complete your first payment to continue. Check out our Quick Start guide for help.",
                        style: .warning
                    )
                    .hedgeFadeIn(delay: 1.0)
                }
                
                // CTA
                HedgePrimaryButton(title: "View Documentation") {
                    // Navigate to docs
                }
                .hedgeFadeIn(delay: 1.1)
            }
            .padding(.screenPadding)
            .padding(.vertical, .space3XL)
        }
        .background(Color.hedgeCream)
    }
}

struct OnboardingProgressView_Previews: PreviewProvider {
    static var previews: some View {
        OnboardingProgressView()
    }
}
```

---

## 🎯 Usage Instructions for Cursor

### Step 1: Copy Files
1. Create `DesignSystem` folder in your project
2. Copy all the Swift files above into separate files
3. Add to your Xcode project

### Step 2: Use Components
```swift
import SwiftUI

struct YourView: View {
    var body: some View {
        VStack {
            // Use the design system
            HedgeTextStyle.title("Hello Hedge")
            
            HedgeCard {
                Text("Card content")
            }
            
            HedgePrimaryButton(title: "Click me") {
                print("Tapped")
            }
        }
        .background(Color.hedgeCream)
    }
}
```

### Step 3: Customize as Needed
All components are modular - you can extend or modify them easily.

---

## 📋 Checklist for Cursor

- [ ] Create all DesignSystem files
- [ ] Add Color extension with hex initializer
- [ ] Add Font extensions for custom fonts
- [ ] Implement animation modifiers
- [ ] Create all UI components
- [ ] Test on iOS simulator
- [ ] Test dark mode (if needed - design system is light-only by default)
- [ ] Test accessibility (VoiceOver, Dynamic Type)
- [ ] Add any custom components specific to your app

---

## 🎨 Design Principles Reminder

1. **NO rounded corners** - Everything is 0pt radius
2. **Serif fonts only** - Use New York (system serif)
3. **Slow animations** - 0.6-0.8s for most transitions
4. **Earth tones** - Browns, creams, tans
5. **Generous spacing** - Let content breathe
6. **Literary aesthetic** - Inspired by book design

---

## 💡 Tips for Cursor

- All color values are defined - just reference `Color.hedgeDarkBrown` etc
- All spacing is in multiples of 4pt - use `.spaceL`, `.spaceXL` etc
- Components are composable - nest them as needed
- Animations are pre-configured - use `.hedgeFadeIn()` modifier
- Typography is consistent - use `HedgeTextStyle` for text

---

This is production-ready! Just copy, paste, and extend. 🚀
