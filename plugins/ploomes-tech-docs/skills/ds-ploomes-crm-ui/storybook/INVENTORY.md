# Inventário de componentes — Ploomes Design System

77 páginas (618 stories): os componentes de `@ploomescrm/ui` mais 4 páginas de
foundations (cores, tokens, tipografia, whitelabel). Para cada componente: o `import`,
as props padrão e **todas** as stories com seu código. O visual correspondente está no
HTML indicado em cada seção.
Fonte: os arquivos `*.stories.tsx` do design system. Gerado em 2026-07-29.

> Helpers citados no `render` (`<XDemo />`, dados de exemplo, ícones) vivem no próprio
> arquivo de story. Blocos com mais de 24 linhas são truncados.

## Não use HTML nativo: use o componente do DS

Um `<select>`, `<input type="date">` ou botão cru sai do padrão visual e do
dark mode/whitelabel. Equivalências obrigatórias:

| Em vez de | Use |
| --- | --- |
| `<select>` / `<option>` | **Field07Options** (`options`, `multiple`) — nunca use `<select>` nativo |
| `<select multiple>` | **Field07Options** com `multiple` (chips/tags) |
| `<input type="text">` | **Field01TextSimple** |
| `<textarea>` | **Field02TextMultiline** · rich text: **Field02TextEditor** |
| `<input type="number">` | **Field04NumberInteger** · decimal **Field06NumberDouble** · R$ **Field05NumberCurrency** · % **Field13NumberPercentage** |
| `<input type="date">` | **Field08Date** |
| `<input type="time">` | **Field09Time** (encapsula o picker nativo via `showPicker()`) |
| `<input type="color">` | **Field20Color** (encapsula `<input type="color">` sobreposto ao swatch) |
| `<input type="file">` | **Field19Attachment** · imagem: **Field18Image** |
| `<input type="checkbox">` | **Field10Checkbox** (booleano: dropdown Sim/Não ou toggle) |
| `<input type="tel">` | **Field07Phone** (com seletor de país) |
| `<input>` de busca | **SearchInput** · com resultados: **SearchableList** |
| CPF / CNPJ | **Field11CPF** · **Field12CNPJ** |
| endereço (CEP, rua, cidade…) | **Field17Address** |
| `<button>` | **ButtonAction** (primário) · **ButtonSoft** (secundário) · **ButtonCheck** · **NestedButton** · **CardButton** |
| menu/dropdown ad-hoc | **Dropdown** · hierárquico: **DeepSelector** · escolher campo: **FieldSelector** |
| `<dialog>` / modal ad-hoc | **ModalCenter** · lateral: **ModalSide** · flutuante: **ModalFloating** · confirmação: **AlertModal** |
| cabeçalho/rodapé de modal | **HeaderModal** · **FooterModal** |
| toast / alerta ad-hoc | **Toaster** (transiente) · **AlertMessage** (inline) |
| `<table>` | **Table** · grid arrastável: **GridView** · ficha de registro: **DataView** |
| `<progress>` | **ProgressBar** |
| loading ad-hoc | **Spinner** · **Loader** · placeholder: **Skeleton** |
| `<nav>` / tabs | **HorizontalTabs** · **HorizontalMenu** · **SubMenuHorizontal** · **VerticalMenu** · **Breadcrumbs** |
| `title=""` como tooltip | **Tooltip** |
| avatar | **ProfileImage** · empilhados: **ProfileGroup** |
| badge / pill | **Badge** · contador: **NotifyBadge** |
| `<details>` / accordion | **Collapse** |
| paginação ad-hoc | **Pagination** · rolagem infinita: **InfiniteScroll** |
| lista reordenável | **DraggableList** |
| galeria de imagens | **ImageGallery** |
| barra de ações | **ActionDock** |
| wizard / passos | **Stepper** |
| estado vazio | **EmptyLabel** |
| texto | **Text** |
| ícones | **Icon** (troca global: **IconProvider**) |
| filtros | **FilterGroup** |
| renomear inline | **RenameableText** |
| código OTP | **CodeInput** |
| ditado por voz | **SpeechToTextButton** |
| painel redimensionável | **ResizableDrawer** || cartão de conteúdo | **Card** |
| favoritar (estrela) | **ButtonFavorite** |
| botão soft que virá ação no hover | **ButtonSoftToAction** |
| conteúdo HTML customizado em iframe | **Field22Developer** |

Campos de **hora**, **cor** e **arquivo** encapsulam de propósito o picker nativo do
browser (`showPicker()`, `<input type="color">`, `<input type="file">`) — use o
componente do DS, que já traz label, validação, tamanhos e temas em volta.

## Componentes

| Componente | Categoria | Stories | Visual |
| --- | --- | --- | --- |
| `Colors` | foundations | 1 | [foundations/Colors.html](foundations/Colors.html) |
| `Tokens` | foundations | 1 | [foundations/Tokens.html](foundations/Tokens.html) |
| `Typography` | foundations | 1 | [foundations/Typography.html](foundations/Typography.html) |
| `Whitelabel` | foundations | 1 | [foundations/Whitelabel.html](foundations/Whitelabel.html) |
| `DraggableList` | atoms | 6 | [atoms/DraggableList.html](atoms/DraggableList.html) |
| `Icon` | atoms | 8 | [atoms/Icon.html](atoms/Icon.html) |
| `NestedButton` | atoms | 6 | [atoms/NestedButton.html](atoms/NestedButton.html) |
| `NotifyBadge` | atoms | 4 | [atoms/NotifyBadge.html](atoms/NotifyBadge.html) |
| `ProfileGroup` | atoms | 4 | [atoms/ProfileGroup.html](atoms/ProfileGroup.html) |
| `ProfileImage` | atoms | 2 | [atoms/ProfileImage.html](atoms/ProfileImage.html) |
| `ProgressBar` | atoms | 4 | [atoms/ProgressBar.html](atoms/ProgressBar.html) |
| `RenameableText` | atoms | 6 | [atoms/RenameableText.html](atoms/RenameableText.html) |
| `Spinner` | atoms | 4 | [atoms/Spinner.html](atoms/Spinner.html) |
| `Tooltip` | atoms | 3 | [atoms/Tooltip.html](atoms/Tooltip.html) |
| `AlertMessage` | components | 8 | [components/AlertMessage.html](components/AlertMessage.html) |
| `Badge` | components | 7 | [components/Badge.html](components/Badge.html) |
| `Breadcrumbs` | components | 10 | [components/Breadcrumbs.html](components/Breadcrumbs.html) |
| `ButtonAction` | components | 9 | [components/ButtonAction.html](components/ButtonAction.html) |
| `ButtonCheck` | components | 10 | [components/ButtonCheck.html](components/ButtonCheck.html) |
| `ButtonFavorite` | components | 8 | [components/ButtonFavorite.html](components/ButtonFavorite.html) |
| `ButtonSoft` | components | 12 | [components/ButtonSoft.html](components/ButtonSoft.html) |
| `ButtonSoftToAction` | components | 8 | [components/ButtonSoftToAction.html](components/ButtonSoftToAction.html) |
| `CardButton` | components | 8 | [components/CardButton.html](components/CardButton.html) |
| `CodeInput` | components | 10 | [components/CodeInput.html](components/CodeInput.html) |
| `DataView` | components | 6 | [components/DataView.html](components/DataView.html) |
| `Dropdown` | components | 12 | [components/Dropdown.html](components/Dropdown.html) |
| `FooterModal` | components | 9 | [components/FooterModal.html](components/FooterModal.html) |
| `HeaderModal` | components | 8 | [components/HeaderModal.html](components/HeaderModal.html) |
| `Pagination` | components | 10 | [components/Pagination.html](components/Pagination.html) |
| `SearchInput` | components | 9 | [components/SearchInput.html](components/SearchInput.html) |
| `Skeleton` | components | 6 | [components/Skeleton.html](components/Skeleton.html) |
| `SpeechToTextButton` | components | 4 | [components/SpeechToTextButton.html](components/SpeechToTextButton.html) |
| `Text` | components | 5 | [components/Text.html](components/Text.html) |
| `Toaster` | components | 9 | [components/Toaster.html](components/Toaster.html) |
| `Field01TextSimple` | fields | 15 | [fields/Field01TextSimple.html](fields/Field01TextSimple.html) |
| `Field02TextEditor` | fields | 9 | [fields/Field02TextEditor.html](fields/Field02TextEditor.html) |
| `Field02TextMultiline` | fields | 14 | [fields/Field02TextMultiline.html](fields/Field02TextMultiline.html) |
| `Field04NumberInteger` | fields | 12 | [fields/Field04NumberInteger.html](fields/Field04NumberInteger.html) |
| `Field05NumberCurrency` | fields | 12 | [fields/Field05NumberCurrency.html](fields/Field05NumberCurrency.html) |
| `Field06NumberDouble` | fields | 12 | [fields/Field06NumberDouble.html](fields/Field06NumberDouble.html) |
| `Field07Options` | fields | 14 | [fields/Field07Options.html](fields/Field07Options.html) |
| `Field07Phone` | fields | 11 | [fields/Field07Phone.html](fields/Field07Phone.html) |
| `Field08Date` | fields | 14 | [fields/Field08Date.html](fields/Field08Date.html) |
| `Field09Time` | fields | 9 | [fields/Field09Time.html](fields/Field09Time.html) |
| `Field10Checkbox` | fields | 16 | [fields/Field10Checkbox.html](fields/Field10Checkbox.html) |
| `Field11CPF` | fields | 10 | [fields/Field11CPF.html](fields/Field11CPF.html) |
| `Field12CNPJ` | fields | 14 | [fields/Field12CNPJ.html](fields/Field12CNPJ.html) |
| `Field13NumberPercentage` | fields | 11 | [fields/Field13NumberPercentage.html](fields/Field13NumberPercentage.html) |
| `Field17Address` | fields | 10 | [fields/Field17Address.html](fields/Field17Address.html) |
| `Field18Image` | fields | 9 | [fields/Field18Image.html](fields/Field18Image.html) |
| `Field19Attachment` | fields | 11 | [fields/Field19Attachment.html](fields/Field19Attachment.html) |
| `Field20Color` | fields | 13 | [fields/Field20Color.html](fields/Field20Color.html) |
| `Field22Developer` | fields | 6 | [fields/Field22Developer.html](fields/Field22Developer.html) |
| `ActionDock` | organisms | 5 | [organisms/ActionDock.html](organisms/ActionDock.html) |
| `AlertModal` | organisms | 7 | [organisms/AlertModal.html](organisms/AlertModal.html) |
| `Card` | organisms | 13 | [organisms/Card.html](organisms/Card.html) |
| `Collapse` | organisms | 13 | [organisms/Collapse.html](organisms/Collapse.html) |
| `DeepSelector` | organisms | 8 | [organisms/DeepSelector.html](organisms/DeepSelector.html) |
| `EmptyLabel` | organisms | 8 | [organisms/EmptyLabel.html](organisms/EmptyLabel.html) |
| `FieldSelector` | organisms | 7 | [organisms/FieldSelector.html](organisms/FieldSelector.html) |
| `FilterGroup` | organisms | 7 | [organisms/FilterGroup.html](organisms/FilterGroup.html) |
| `GridView` | organisms | 5 | [organisms/GridView.html](organisms/GridView.html) |
| `HorizontalMenu` | organisms | 7 | [organisms/HorizontalMenu.html](organisms/HorizontalMenu.html) |
| `HorizontalTabs` | organisms | 7 | [organisms/HorizontalTabs.html](organisms/HorizontalTabs.html) |
| `ImageGallery` | organisms | 7 | [organisms/ImageGallery.html](organisms/ImageGallery.html) |
| `InfiniteScroll` | organisms | 5 | [organisms/InfiniteScroll.html](organisms/InfiniteScroll.html) |
| `Loader` | organisms | 5 | [organisms/Loader.html](organisms/Loader.html) |
| `ModalCenter` | organisms | 7 | [organisms/ModalCenter.html](organisms/ModalCenter.html) |
| `ModalFloating` | organisms | 8 | [organisms/ModalFloating.html](organisms/ModalFloating.html) |
| `ModalSide` | organisms | 11 | [organisms/ModalSide.html](organisms/ModalSide.html) |
| `ResizableDrawer` | organisms | 7 | [organisms/ResizableDrawer.html](organisms/ResizableDrawer.html) |
| `SearchableList` | organisms | 7 | [organisms/SearchableList.html](organisms/SearchableList.html) |
| `Stepper` | organisms | 8 | [organisms/Stepper.html](organisms/Stepper.html) |
| `SubMenuHorizontal` | organisms | 7 | [organisms/SubMenuHorizontal.html](organisms/SubMenuHorizontal.html) |
| `Table` | organisms | 9 | [organisms/Table.html](organisms/Table.html) |
| `VerticalMenu` | organisms | 5 | [organisms/VerticalMenu.html](organisms/VerticalMenu.html) |
| `IconProvider` | providers | 4 | [providers/IconProvider.html](providers/IconProvider.html) |

## Foundations

### Colors

Visual: `foundations/Colors.html` · stories: `Colors.stories.tsx` (1)

```tsx
// Página de documentação de tokens — não consome componentes de @ploomescrm/ui.
```

**Default**

```tsx
export const Default: Story = {}
```

### Tokens

Visual: `foundations/Tokens.html` · stories: `Tokens.stories.tsx` (1)

```tsx
// Página de documentação de tokens — não consome componentes de @ploomescrm/ui.
```

**Default**

```tsx
export const Default: Story = {}
```

### Typography

Visual: `foundations/Typography.html` · stories: `Typography.stories.tsx` (1)

```tsx
// Página de documentação de tokens — não consome componentes de @ploomescrm/ui.
```

**Default**

```tsx
export const Default: Story = {}
```

### Whitelabel

Visual: `foundations/Whitelabel.html` · stories: `Whitelabel.stories.tsx` (1)

```tsx
import { WhitelabelProvider } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  brandColor: '#E6334A',
  actionColor: '#1A94FF',
}
```

**Playground**

```tsx
export const Playground: Story = {}
```

## Atoms

### DraggableList

Visual: `atoms/DraggableList.html` · stories: `DraggableList.stories.tsx` (6)

```tsx
import { DraggableList } from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: () => <VerticalDemo />,
}
```

**With drag handle**

```tsx
export const WithHandle: Story = {
  name: 'With drag handle',
  render: () => <VerticalDemo showHandle />,
}
```

**Horizontal**

```tsx
export const Horizontal: Story = {
  render: () => <HorizontalDemo />,
}
```

**onDragEnd callback**

```tsx
export const WithDragEndCallback: Story = {
  name: 'onDragEnd callback',
  render: () => <DragEndDemo />,
}
```

**Item-level disable**

```tsx
export const PartiallyDisabled: Story = {
  name: 'Item-level disable',
  render: () => <PartiallyDisabledDemo />,
}
```

**Dragging disabled**

```tsx
export const Disabled: Story = {
  name: 'Dragging disabled',
  render: () => (
    <DraggableList
      items={initialItems}
      disableDragging
      onReorder={() => {}}
      className="gap-[5px]"
      renderItem={(item) => <Row label={item} />}
    />
  ),
}
```

### Icon

Visual: `atoms/Icon.html` · stories: `Icon.stories.tsx` (8)

```tsx
import { Icon, type IconSource } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  // Key from the `mapping` above — Storybook resolves it to the mapped icon.
  icon: 'House' as unknown as IconSource,
  color: 'default',
  size: 'big_30',
  filled: false,
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Colors**

```tsx
export const Colors: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Icon {...args} color="default" />
      <Icon {...args} color="brand" />
      <Icon {...args} color="success" />
      <Icon {...args} color="danger" />
      <Icon {...args} color="alert" />
      <Icon {...args} color="confirmation" />
      <span style={{ background: '#1B102C', padding: 4, borderRadius: 4 }}>
        <Icon {...args} color="inverse" />
      </span>
    </div>
  ),
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'flex-end',
        flexWrap: 'wrap',
      }}
    >
      <Icon {...args} size="tiny_10" />
      <Icon {...args} size="small_15" />
      <Icon {...args} size="normal_20" />
      <Icon {...args} size="big_30" />
      <Icon {...args} size="giant_90" />
    </div>
  ),
}
```

**Filled**

```tsx
export const Filled: Story = {
  args: {
    icon: 'Star' as unknown as LucideIcon,
    filled: true,
    color: 'alert',
  },
}
```

**Gallery**

```tsx
export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {Object.entries(iconMapping).map(([name, iconSource]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            width: 80,
          }}
        >
          <Icon icon={iconSource} size="normal_20" />
          <span
            style={{
              fontSize: 10,
              color: '#888',
              textAlign: 'center',
              wordBreak: 'break-all',
            }}
          >
            {name}
  // … +6 linhas — ver o arquivo da story
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => {
    const colors = [
      'default',
      'brand',
      'success',
      'danger',
      'alert',
      'confirmation',
    ] as const;
    const sizes = [
      'tiny_10',
      'small_15',
      'normal_20',
      'big_30',
      'giant_90',
    ] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {colors.map((color) => (
          <div
            key={color}
            style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}
          >
  // … +12 linhas — ver o arquivo da story
```

**Font Awesome**

```tsx
export const FontAwesome: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {Object.entries(faIconMapping).map(([name, node]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            width: 80,
          }}
        >
          <Icon icon={node} size="normal_20" />
          <span
            style={{
              fontSize: 10,
              color: '#888',
              textAlign: 'center',
              wordBreak: 'break-all',
            }}
          >
            {name}
  // … +6 linhas — ver o arquivo da story
```

**Mixed Libraries**

```tsx
export const MixedLibraries: Story = {
  render: () => {
    const sizes = [
      'tiny_10',
      'small_15',
      'normal_20',
      'big_30',
      'giant_90',
    ] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          {sizes.map((size) => (
            <Icon key={size} icon={Star} color="brand" size={size} />
          ))}
          <span style={{ fontSize: 11, color: '#888', alignSelf: 'center' }}>
            lucide-react
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          {sizes.map((size) => (
            <Icon
              key={size}
              icon={<FontAwesomeIcon icon={faStar} />}
  // … +12 linhas — ver o arquivo da story
```

### NestedButton

Visual: `atoms/NestedButton.html` · stories: `NestedButton.stories.tsx` (6)

```tsx
import { NestedButton, Icon } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  size: 'small_20',
  mode: 'light',
  outline: true,
  disabled: false,
  // icon-only buttons need an accessible name
  'aria-label': 'Mais opções',
}
```

**Default**

```tsx
export const Default: Story = {
  render: (args) => (
    <NestedButton {...args}>
      <Icon icon={Ellipsis} size="small_15" />
    </NestedButton>
  ),
}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <NestedButton {...args} size="small_20">
        <Icon icon={Ellipsis} size="tiny_10" />
      </NestedButton>
      <NestedButton {...args} size="normal_25">
        <Icon icon={Ellipsis} size="small_15" />
      </NestedButton>
      <NestedButton {...args} size="big_30">
        <Icon icon={Ellipsis} size="small_15" />
      </NestedButton>
    </div>
  ),
}
```

**Outline**

```tsx
export const Outline: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <NestedButton {...args} outline={true}>
        <Icon icon={Ellipsis} size="small_15" />
      </NestedButton>
      <NestedButton {...args} outline={false}>
        <Icon icon={Ellipsis} size="small_15" />
      </NestedButton>
    </div>
  ),
}
```

**Dark Mode**

```tsx
export const DarkMode: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        background: '#1B102C',
        padding: 16,
        borderRadius: 8,
      }}
    >
      <NestedButton {...args} mode="dark" outline={true}>
        <Icon icon={Ellipsis} size="tiny_10" />
      </NestedButton>
      <NestedButton
        {...args}
        mode="dark"
        outline={false}
        aria-label="Mais opções"
      >
        <Icon icon={Ellipsis} size="tiny_10" />
      </NestedButton>
      <NestedButton {...args} mode="dark" size="normal_25">
  // … +8 linhas — ver o arquivo da story
```

**Disabled**

```tsx
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <NestedButton {...args} disabled>
        <Icon icon={Ellipsis} size="small_15" />
      </NestedButton>
    </div>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => {
    const sizes = ['small_20', 'normal_25', 'big_30'] as const;
    const iconSize = {
      small_20: 'tiny_10',
      normal_25: 'small_15',
      big_30: 'small_15',
    } as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {sizes.map((size) => (
            <React.Fragment key={size}>
              <NestedButton
                size={size}
                mode="light"
                outline
  // … +69 linhas — ver o arquivo da story
```

### NotifyBadge

Visual: `atoms/NotifyBadge.html` · stories: `NotifyBadge.stories.tsx` (4)

```tsx
import { NotifyBadge } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  color: 'alert',
  size: 'tiny',
  children: '99+',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Colors**

```tsx
export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <NotifyBadge {...args} color="alert" />
      <NotifyBadge {...args} color="brand" />
      <NotifyBadge {...args} color="default" />
    </div>
  ),
}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <NotifyBadge {...args} size="tiny" />
      <NotifyBadge {...args} size="small" />
    </div>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['tiny', 'small'] as const).map((size) => (
        <div
          key={size}
          style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <NotifyBadge size={size} color="alert" />
          <NotifyBadge size={size} color="brand" />
          <NotifyBadge size={size} color="default" />
          <NotifyBadge size={size} color="alert">
            3
          </NotifyBadge>
          <NotifyBadge size={size} color="brand">
            12
          </NotifyBadge>
        </div>
      ))}
    </div>
  ),
}
```

### ProfileGroup

Visual: `atoms/ProfileGroup.html` · stories: `ProfileGroup.stories.tsx` (4)

```tsx
import { ProfileGroup } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  images: AVATARS.slice(0, 3),
  size: 'small',
  max: 3,
}
```

**Default**

```tsx
export const Default: Story = {}
```

**With Overflow**

```tsx
export const WithOverflow: Story = {
  args: {
    images: AVATARS,
    max: 3,
  },
}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProfileGroup {...args} size="tiny" images={AVATARS} max={3} />
      <ProfileGroup {...args} size="small" images={AVATARS} max={3} />
      <ProfileGroup {...args} size="normal" images={AVATARS} max={3} />
    </div>
  ),
}
```

**Amounts**

```tsx
export const Amounts: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProfileGroup {...args} images={AVATARS.slice(0, 2)} max={3} />
      <ProfileGroup {...args} images={AVATARS.slice(0, 3)} max={3} />
      <ProfileGroup {...args} images={AVATARS} max={3} />
    </div>
  ),
}
```

### ProfileImage

Visual: `atoms/ProfileImage.html` · stories: `ProfileImage.stories.tsx` (2)

```tsx
import { ProfileImage } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  src: PLACEHOLDER,
  size: 'tiny',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <ProfileImage {...args} size="tiny" src={PLACEHOLDER} />
      <ProfileImage {...args} size="small" src={PLACEHOLDER} />
      <ProfileImage {...args} size="normal" src={PLACEHOLDER} />
    </div>
  ),
}
```

### ProgressBar

Visual: `atoms/ProgressBar.html` · stories: `ProgressBar.stories.tsx` (4)

```tsx
import { ProgressBar } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  size: 'normal',
  value: 60,
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}
    >
      <ProgressBar {...args} size="small" />
      <ProgressBar {...args} size="normal" />
      <ProgressBar {...args} size="big" />
    </div>
  ),
}
```

**Values**

```tsx
export const Values: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}
    >
      <ProgressBar size="normal" value={0} />
      <ProgressBar size="normal" value={25} />
      <ProgressBar size="normal" value={50} />
      <ProgressBar size="normal" value={75} />
      <ProgressBar size="normal" value={100} />
    </div>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}
    >
      {(['small', 'normal', 'big'] as const).map((size) => (
        <ProgressBar key={size} size={size} value={60} />
      ))}
    </div>
  ),
}
```

### RenameableText

Visual: `atoms/RenameableText.html` · stories: `RenameableText.stories.tsx` (6)

```tsx
import { RenameableText } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  defaultValue: 'Clique duas vezes para renomear',
  placeholder: 'Digite um nome',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**With Max Length**

```tsx
export const WithMaxLength: Story = {
  args: {
    defaultValue: 'Máximo de 20 caracteres',
    maxLength: 20,
  },
}
```

**Full Width Centered**

```tsx
export const FullWidthCentered: Story = {
  args: {
    defaultValue: 'Ocupa toda a largura, centralizado',
    hugContents: false,
    align: 'center',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        width: 400,
        border: '1px dashed #ccc',
        padding: 8,
      }}
    >
      <RenameableText {...args} />
    </div>
  ),
}
```

**Truncated Text**

```tsx
export const TruncatedText: Story = {
  args: {
    defaultValue:
      'Um nome bem longo que não cabe no espaço disponível e ganha reticências no final',
  },
  render: (args) => (
    <div style={{ width: 220 }}>
      <RenameableText {...args} />
    </div>
  ),
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
```

**Imperative Open**

```tsx
export const ImperativeOpen: Story = {
  render: () => <ImperativeDemo />,
}
```

### Spinner

Visual: `atoms/Spinner.html` · stories: `Spinner.stories.tsx` (4)

```tsx
import { Spinner } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  color: 'light',
  size: 'normal_20',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Colors**

```tsx
export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <Spinner {...args} color="light" />
      <div className="rounded bg-[#1B102C] p-2">
        <Spinner {...args} color="dark" />
      </div>
      <Spinner {...args} color="brand" />
      <Spinner {...args} color="confirmation" />
    </div>
  ),
}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-6">
      <Spinner {...args} size="small_15" />
      <Spinner {...args} size="normal_20" />
      <Spinner {...args} size="big_30" />
      <Spinner {...args} size="giant_90" />
    </div>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => {
    const colors = ['light', 'dark', 'brand', 'confirmation'] as const;
    const sizes = ['small_15', 'normal_20', 'big_30', 'giant_90'] as const;
    return (
      <div className="flex flex-col gap-6">
        {colors.map((color) => (
          <div
            key={color}
            className="flex items-end gap-6 rounded p-3"
            style={{ background: color === 'dark' ? '#1B102C' : undefined }}
          >
            {sizes.map((size) => (
              <Spinner key={size} color={color} size={size} />
            ))}
            <span
              className="self-center text-xs"
              style={{ color: color === 'dark' ? '#fff' : '#888' }}
            >
              {color}
            </span>
          </div>
        ))}
      </div>
  // … +3 linhas — ver o arquivo da story
```

### Tooltip

Visual: `atoms/Tooltip.html` · stories: `Tooltip.stories.tsx` (3)

```tsx
import { Tooltip, TooltipTrigger } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  children: 'Lorem Ipsum',
  placement: 'top',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Placements**

```tsx
export const Placements: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', gap: 32, alignItems: 'center', padding: 32 }}
    >
      <Tooltip {...args} placement="top" />
      <Tooltip {...args} placement="right" />
      <Tooltip {...args} placement="left" />
      <Tooltip {...args} placement="bottom" />
    </div>
  ),
}
```

**Trigger**

```tsx
export const Trigger: StoryObj<typeof TooltipTrigger> = {
  render: () => (
    <div
      style={{ display: 'flex', gap: 48, alignItems: 'center', padding: 64 }}
    >
      {(['top', 'right', 'left', 'bottom'] as const).map((placement) => (
        <TooltipTrigger
          key={placement}
          content={`Tooltip ${placement}`}
          placement={placement}
        >
          <button
            type="button"
            style={{
              padding: '6px 12px',
              borderRadius: 5,
              border: '1px solid #ccc',
            }}
          >
            {placement}
          </button>
        </TooltipTrigger>
      ))}
    </div>
  // … +2 linhas — ver o arquivo da story
```

## Components

### AlertMessage

Visual: `components/AlertMessage.html` · stories: `AlertMessage.stories.tsx` (8)

```tsx
import { AlertMessage } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  color: 'alert',
  removable: true,
  children:
    'Sea abstract sea sea superiority endless love ascetic against chaos. Gains value free disgust pinnacle marvelous eternal-return insofar fearful justice.',
}
```

**Warning**

```tsx
export const Warning: Story = {
  args: { color: 'alert' },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { color: 'danger' },
}
```

**Success**

```tsx
export const Success: Story = {
  args: { color: 'success' },
}
```

**Info**

```tsx
export const Info: Story = {
  args: { color: 'confirmation' },
}
```

**Neutral**

```tsx
export const Neutral: Story = {
  args: { color: 'neutral' },
}
```

**Not Removable**

```tsx
export const NotRemovable: Story = {
  args: { color: 'confirmation', removable: false },
}
```

**All Colors**

```tsx
export const AllColors: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 550,
      }}
    >
      <AlertMessage {...args} color="alert">
        Warning: ação requer atenção.
      </AlertMessage>
      <AlertMessage {...args} color="danger">
        Danger: algo crítico ocorreu.
      </AlertMessage>
      <AlertMessage {...args} color="success">
        Success: operação realizada com sucesso.
      </AlertMessage>
      <AlertMessage {...args} color="confirmation">
        Info: você tem uma nova mensagem.
      </AlertMessage>
      <AlertMessage {...args} color="neutral">
        Neutral: informação geral sem criticidade.
  // … +4 linhas — ver o arquivo da story
```

**Dismissable**

```tsx
export const Dismissable: Story = {
  render: () => <DismissableDemo />,
}
```

### Badge

Visual: `components/Badge.html` · stories: `Badge.stories.tsx` (7)

```tsx
import { Badge } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  children: 'Lorem Ipsum',
  color: 'default',
  size: 'sm',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**With Left Icon**

```tsx
export const WithLeftIcon: Story = {
  args: { leftIcon: <InfoIcon /> },
}
```

**With Both Icons**

```tsx
export const WithBothIcons: Story = {
  args: { leftIcon: <InfoIcon />, rightIcon: <ChevronDown /> },
}
```

**Icon Only**

```tsx
export const IconOnly: Story = {
  args: { leftIcon: <InfoIcon />, children: undefined },
}
```

**Colors**

```tsx
export const Colors: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Badge {...args} color="default" leftIcon={<InfoIcon />}>
        Default
      </Badge>
      <Badge {...args} color="brand" leftIcon={<InfoIcon />}>
        Brand
      </Badge>
      <Badge {...args} color="alert" leftIcon={<InfoIcon />}>
        Warning
      </Badge>
      <Badge {...args} color="confirmation" leftIcon={<InfoIcon />}>
        Info
      </Badge>
      <Badge {...args} color="success" leftIcon={<InfoIcon />}>
        Success
  // … +7 linhas — ver o arquivo da story
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Badge {...args} size="xs" leftIcon={<InfoIcon />}>
        Tiny 20
      </Badge>
      <Badge {...args} size="sm" leftIcon={<InfoIcon />}>
        Small 30
      </Badge>
      <Badge {...args} size="md" leftIcon={<InfoIcon />}>
        Normal 35
      </Badge>
      <Badge {...args} size="lg" leftIcon={<InfoIcon />}>
        Big 40
      </Badge>
    </div>
  ),
  // … +1 linhas — ver o arquivo da story
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(
        [
          'default',
          'brand',
          'alert',
          'confirmation',
          'success',
          'danger',
        ] as const
      ).map((color) => (
        <div
          key={color}
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
            <React.Fragment key={size}>
  // … +19 linhas — ver o arquivo da story
```

### Breadcrumbs

Visual: `components/Breadcrumbs.html` · stories: `Breadcrumbs.stories.tsx` (10)

```tsx
import { Breadcrumbs } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  size: 'md',
}
```

**Single Item**

```tsx
export const SingleItem: Story = {
  args: { items: singleItem },
}
```

**Two Items**

```tsx
export const TwoItems: Story = {
  args: { items: twoItems },
}
```

**Three Items**

```tsx
export const ThreeItems: Story = {
  args: { items: threeItems },
}
```

**Four Items**

```tsx
export const FourItems: Story = {
  args: { items: fourItems },
}
```

**Five Items Collapsed**

```tsx
export const FiveItemsCollapsed: Story = {
  args: { items: fiveItems },
}
```

**Small Size**

```tsx
export const SmallSize: Story = {
  args: { items: threeItems, size: 'sm' },
}
```

**Small Collapsed**

```tsx
export const SmallCollapsed: Story = {
  args: { items: fiveItems, size: 'sm' },
}
```

**Long Labels**

```tsx
export const LongLabels: Story = {
  args: { items: longLabelItems },
}
```

**Both Sizes**

```tsx
export const BothSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Breadcrumbs {...args} items={threeItems} size="md" />
      <Breadcrumbs {...args} items={threeItems} size="sm" />
    </div>
  ),
}
```

**Interactive Ellipsis**

```tsx
export const InteractiveEllipsis: Story = {
  render: () => <EllipsisDemo />,
}
```

### ButtonAction

Visual: `components/ButtonAction.html` · stories: `ButtonAction.stories.tsx` (9)

```tsx
import { ButtonAction } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  children: 'Lorem Ipsum',
  color: 'confirmation',
  size: 'sm',
  disabled: false,
}
```

**Default**

```tsx
export const Default: Story = {
  args: { leftIcon: <Icon /> },
}
```

**Brand**

```tsx
export const Brand: Story = {
  args: { color: 'brand', leftIcon: <Icon /> },
}
```

**AI**

```tsx
export const AI: Story = {
  args: { color: 'ai', leftIcon: <Icon /> },
}
```

**With Right Icon**

```tsx
export const WithRightIcon: Story = {
  args: { leftIcon: <Icon />, rightIcon: <Chevron /> },
}
```

**Icon Only**

```tsx
export const IconOnly: Story = {
  args: { leftIcon: <Icon />, children: undefined },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { leftIcon: <Icon />, disabled: true },
}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ButtonAction {...args} size="sm" leftIcon={<Icon />}>
        Small
      </ButtonAction>
      <ButtonAction {...args} size="md" leftIcon={<Icon />}>
        Medium
      </ButtonAction>
      <ButtonAction {...args} size="lg" leftIcon={<Icon />}>
        Large
      </ButtonAction>
    </div>
  ),
}
```

**Colors**

```tsx
export const Colors: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <ButtonAction {...args} color="confirmation" leftIcon={<Icon />}>
        Info (Confirmation)
      </ButtonAction>
      <ButtonAction {...args} color="brand" leftIcon={<Icon />}>
        Brand
      </ButtonAction>
      <ButtonAction {...args} color="ai" leftIcon={<Icon />}>
        AI
      </ButtonAction>
    </div>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['confirmation', 'brand', 'ai'] as const).map((color) => (
        <div
          key={color}
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <ButtonAction color={color} size="sm" leftIcon={<Icon />}>
            Small
          </ButtonAction>
          <ButtonAction color={color} size="md" leftIcon={<Icon />}>
            Medium
          </ButtonAction>
          <ButtonAction color={color} size="lg" leftIcon={<Icon />}>
            Large
          </ButtonAction>
          <ButtonAction
            color={color}
  // … +20 linhas — ver o arquivo da story
```

### ButtonCheck

Visual: `components/ButtonCheck.html` · stories: `ButtonCheck.stories.tsx` (10)

```tsx
import { ButtonCheck } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  children: 'Lorem Ipsum',
  shape: 'square',
  size: 'sm',
  checked: false,
  disabled: false,
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Checked**

```tsx
export const Checked: Story = {
  args: { checked: true },
}
```

**Rounded**

```tsx
export const Rounded: Story = {
  args: { shape: 'rounded' },
}
```

**Rounded (Checked)**

```tsx
export const RoundedChecked: Story = {
  name: 'Rounded (Checked)',
  args: { shape: 'rounded', checked: true },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true },
}
```

**Disabled (Checked)**

```tsx
export const DisabledChecked: Story = {
  name: 'Disabled (Checked)',
  args: { disabled: true, checked: true },
}
```

**Icon Only**

```tsx
export const IconOnly: Story = {
  args: { children: undefined },
}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ButtonCheck {...args} size="sm">
        Small (30px)
      </ButtonCheck>
      <ButtonCheck {...args} size="md">
        Medium (35px)
      </ButtonCheck>
      <ButtonCheck {...args} size="lg">
        Large (40px)
      </ButtonCheck>
    </div>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(['square', 'rounded'] as const).map((shape) => (
        <div
          key={shape}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <p
            style={{
              fontSize: 12,
              textTransform: 'capitalize',
              color: '#888',
              margin: 0,
            }}
          >
            {shape}
          </p>
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
  // … +32 linhas — ver o arquivo da story
```

**Interactive**

```tsx
export const Interactive: Story = {
  render: () => <ToggleDemo />,
}
```

### ButtonFavorite

Visual: `components/ButtonFavorite.html` · stories: `ButtonFavorite.stories.tsx` (8)

```tsx
import { ButtonFavorite } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  size: 'sm',
  outline: true,
  active: false,
  disabled: false,
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Active**

```tsx
export const Active: Story = {
  args: { active: true },
}
```

**Ghost**

```tsx
export const Ghost: Story = {
  args: { outline: false },
}
```

**Ghost (Active)**

```tsx
export const GhostActive: Story = {
  name: 'Ghost (Active)',
  args: { outline: false, active: true },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true },
}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ButtonFavorite {...args} size="sm" />
      <ButtonFavorite {...args} size="md" />
      <ButtonFavorite {...args} size="lg" />
    </div>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div
          key={size}
          style={{ display: 'flex', gap: 16, alignItems: 'center' }}
        >
          <span style={{ fontSize: 12, color: '#888', width: 24 }}>{size}</span>
          <ButtonFavorite size={size} outline />
          <ButtonFavorite size={size} outline active />
          <ButtonFavorite size={size} outline={false} />
          <ButtonFavorite size={size} outline={false} active />
          <ButtonFavorite size={size} outline disabled />
          <ButtonFavorite size={size} outline active disabled />
        </div>
      ))}
    </div>
  ),
}
```

**Interactive**

```tsx
export const Interactive: Story = {
  render: () => <ToggleDemo />,
}
```

### ButtonSoft

Visual: `components/ButtonSoft.html` · stories: `ButtonSoft.stories.tsx` (12)

```tsx
import { ButtonSoft } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  children: 'Lorem Ipsum',
  variant: 'outline',
  color: 'neutral',
  size: 'sm',
  active: false,
  selected: false,
  disabled: false,
}
```

**Default**

```tsx
export const Default: Story = {}
```

**With Left Icon**

```tsx
export const WithLeftIcon: Story = {
  args: { leftIcon: <Icon /> },
}
```

**With Right Icon**

```tsx
export const WithRightIcon: Story = {
  args: { rightIcon: <Chevron /> },
}
```

**With Both Icons**

```tsx
export const WithBothIcons: Story = {
  args: { leftIcon: <Icon />, rightIcon: <Chevron /> },
}
```

**Active**

```tsx
export const Active: Story = {
  args: { leftIcon: <Icon />, active: true },
}
```

**Selected**

```tsx
export const Selected: Story = {
  args: { leftIcon: <Icon />, selected: true },
}
```

**Ghost**

```tsx
export const Ghost: Story = {
  args: { variant: 'ghost', leftIcon: <Icon /> },
}
```

**AI**

```tsx
export const AI: Story = {
  args: { color: 'ai', leftIcon: <Icon /> },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { leftIcon: <Icon />, disabled: true },
}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ButtonSoft {...args} size="sm" leftIcon={<Icon />}>
        Small
      </ButtonSoft>
      <ButtonSoft {...args} size="md" leftIcon={<Icon />}>
        Medium
      </ButtonSoft>
      <ButtonSoft {...args} size="lg" leftIcon={<Icon />}>
        Large
      </ButtonSoft>
    </div>
  ),
}
```

**Variants**

```tsx
export const Variants: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <ButtonSoft {...args} variant="outline" leftIcon={<Icon />}>
        Outline
      </ButtonSoft>
      <ButtonSoft {...args} variant="outline" active leftIcon={<Icon />}>
        Outline Active
      </ButtonSoft>
      <ButtonSoft {...args} variant="outline" selected leftIcon={<Icon />}>
        Outline Selected
      </ButtonSoft>
      <ButtonSoft {...args} variant="ghost" leftIcon={<Icon />}>
        Ghost
      </ButtonSoft>
      <ButtonSoft {...args} variant="ghost" active leftIcon={<Icon />}>
        Ghost Active
  // … +7 linhas — ver o arquivo da story
```

**All Sizes And Variants**

```tsx
export const AllSizesAndVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div
          key={size}
          style={{ display: 'flex', gap: 12, alignItems: 'center' }}
        >
          <ButtonSoft size={size} variant="outline" leftIcon={<Icon />}>
            Outline {size}
          </ButtonSoft>
          <ButtonSoft size={size} variant="outline" active leftIcon={<Icon />}>
            Active {size}
          </ButtonSoft>
          <ButtonSoft size={size} variant="ghost" leftIcon={<Icon />}>
            Ghost {size}
          </ButtonSoft>
          <ButtonSoft
            size={size}
            variant="outline"
            leftIcon={<Icon />}
            rightIcon={<Chevron />}
          >
            With Icons {size}
  // … +6 linhas — ver o arquivo da story
```

### ButtonSoftToAction

Visual: `components/ButtonSoftToAction.html` · stories: `ButtonSoftToAction.stories.tsx` (8)

```tsx
import { ButtonSoftToAction } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  children: 'Lorem Ipsum',
  color: 'confirmation',
  variant: 'outline',
  size: 'sm',
  active: false,
  disabled: false,
}
```

**Default**

```tsx
export const Default: Story = {
  args: { leftIcon: <Icon /> },
}
```

**Active**

```tsx
export const Active: Story = {
  args: { leftIcon: <Icon />, active: true },
}
```

**Ghost**

```tsx
export const Ghost: Story = {
  args: { variant: 'ghost', leftIcon: <Icon /> },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { leftIcon: <Icon />, disabled: true },
}
```

**With Right Icon**

```tsx
export const WithRightIcon: Story = {
  args: { leftIcon: <Icon />, rightIcon: <Chevron /> },
}
```

**Colors**

```tsx
export const Colors: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <ButtonSoftToAction {...args} color="confirmation" leftIcon={<Icon />}>
        Info
      </ButtonSoftToAction>
      <ButtonSoftToAction {...args} color="danger" leftIcon={<Icon />}>
        Danger
      </ButtonSoftToAction>
      <ButtonSoftToAction {...args} color="alert" leftIcon={<Icon />}>
        Warning
      </ButtonSoftToAction>
      <ButtonSoftToAction {...args} color="success" leftIcon={<Icon />}>
        Success
      </ButtonSoftToAction>
      <ButtonSoftToAction {...args} color="ai" leftIcon={<Icon />}>
        AI
  // … +4 linhas — ver o arquivo da story
```

**Colors (Active)**

```tsx
export const ColorsActive: Story = {
  name: 'Colors (Active)',
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <ButtonSoftToAction
        {...args}
        color="confirmation"
        active
        leftIcon={<Icon />}
      >
        Info
      </ButtonSoftToAction>
      <ButtonSoftToAction {...args} color="danger" active leftIcon={<Icon />}>
        Danger
      </ButtonSoftToAction>
      <ButtonSoftToAction {...args} color="alert" active leftIcon={<Icon />}>
        Warning
  // … +10 linhas — ver o arquivo da story
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(['confirmation', 'danger', 'alert', 'success', 'ai'] as const).map(
        (color) => (
          <div
            key={color}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <ButtonSoftToAction
              color={color}
              variant="outline"
              size="sm"
              leftIcon={<Icon />}
            >
              Outline {color}
            </ButtonSoftToAction>
            <ButtonSoftToAction
              color={color}
  // … +47 linhas — ver o arquivo da story
```

### CardButton

Visual: `components/CardButton.html` · stories: `CardButton.stories.tsx` (8)

```tsx
import { CardButton } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Lorem Ipsum',
  subtitle: 'Cliente: Marcos Aurélio',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**With Image**

```tsx
export const WithImage: Story = {
  args: { leftImage: AVATAR, leftImageAlt: 'Marcos Aurélio' },
}
```

**With Icon**

```tsx
export const WithIcon: Story = {
  args: { leftIcon: <UserIcon /> },
}
```

**No Subtitle**

```tsx
export const NoSubtitle: Story = {
  args: { subtitle: undefined },
}
```

**No Subtitle With Image**

```tsx
export const NoSubtitleWithImage: Story = {
  args: { leftImage: AVATAR, subtitle: undefined },
}
```

**No Left**

```tsx
export const NoLeft: Story = {
  args: { leftImage: undefined, leftIcon: undefined },
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: 2,
        border: '1px dashed #c084fc',
        padding: 4,
        width: 'fit-content',
      }}
    >
      <CardButton
        label="Lorem Ipsum"
        subtitle="Cliente: Marcos Aurélio"
        leftImage={AVATAR}
      />
      <CardButton
        label="Lorem Ipsum"
        subtitle="Cliente: Marcos Aurélio"
        leftIcon={<UserIcon />}
      />

      <CardButton
  // … +27 linhas — ver o arquivo da story
```

**Truncation**

```tsx
export const Truncation: Story = {
  args: {
    label: 'Texto muito longo que deve ser truncado',
    subtitle: 'Subtitle muito longa que também trunca',
    leftImage: AVATAR,
  },
}
```

### CodeInput

Visual: `components/CodeInput.html` · stories: `CodeInput.stories.tsx` (10)

```tsx
import { CodeInput } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  language: 'javascript',
  theme: 'vs',
  height: '300px',
}
```

**Default**

```tsx
export const Default: Story = {
  args: { defaultValue: SAMPLE_JS },
}
```

**Html**

```tsx
export const Html: Story = {
  args: { language: 'html', defaultValue: SAMPLE_HTML },
}
```

**With Language Selector**

```tsx
export const WithLanguageSelector: Story = {
  args: { showLanguageSelector: true, defaultValue: SAMPLE_JS },
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(SAMPLE_JSON);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CodeInput
          {...args}
          language="json"
          value={value}
          onChange={setValue}
        />
        <span style={{ fontSize: 13 }}>{value.length} caracteres</span>
      </div>
    );
  },
}
```

**Dark Theme**

```tsx
export const DarkTheme: Story = {
  args: { theme: 'vs-dark', defaultValue: SAMPLE_JS },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: SAMPLE_JS },
}
```

**Not Resizable**

```tsx
export const NotResizable: Story = {
  args: { resizable: false, defaultValue: SAMPLE_JS },
}
```

**Without Expand Button**

```tsx
export const WithoutExpandButton: Story = {
  args: { hideExpandButton: true, defaultValue: SAMPLE_JS },
}
```

**Custom Height**

```tsx
export const CustomHeight: Story = {
  args: { height: '150px', defaultValue: SAMPLE_JS },
}
```

**With Minimap And Custom Options**

```tsx
export const WithMinimapAndCustomOptions: Story = {
  args: {
    defaultValue: SAMPLE_JS,
    editorOptions: { minimap: { enabled: true }, lineNumbers: 'off' },
  },
}
```

### DataView

Visual: `components/DataView.html` · stories: `DataView.stories.tsx` (6)

```tsx
import {
  Badge,
  ButtonSoft,
  DataView,
  Icon,
  NestedButton,
  type DataViewCategory,
  type DataViewData,
  type DataViewItems,
} from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <DataView
        {...args}
        categories={CATEGORIES}
        items={buildItems()}
        defaultExpandedCategories={['general']}
      />
    </div>
  ),
}
```

**All Expanded**

```tsx
export const AllExpanded: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <DataView
        {...args}
        categories={CATEGORIES}
        items={buildItems()}
        defaultExpandedCategories={CATEGORIES.map((category) => category.key)}
      />
    </div>
  ),
}
```

**With Row Actions**

```tsx
export const WithRowActions: Story = {
  render: (args) => {
    const actions: DataViewData['actions'] = ({ data }) => (
      <NestedButton
        size="normal_25"
        aria-label={`Editar ${data.name}`}
        onClick={() => alert(`Editar "${data.name}"`)}
      >
        <Icon icon={Pencil} size="small_15" />
      </NestedButton>
    );

    const items = buildItems();
    const withActions: DataViewItems = Object.fromEntries(
      Object.entries(items).map(([key, data]) => [
        key,
        data.map((item) => ({ ...item, actions })),
      ]),
    );

    return (
      <div style={{ maxWidth: 640 }}>
        <DataView
          {...args}
  // … +8 linhas — ver o arquivo da story
```

**Hidden Items Only**

```tsx
export const HiddenItemsOnly: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <DataView
        {...args}
        categories={[
          { key: 'general', name: 'Dados gerais' },
          {
            key: 'internal',
            name: 'Campos internos',
            emptyItemsText: 'Nenhum campo interno preenchido',
          },
        ]}
        items={{
          general: buildItems().general,
          internal: [
            {
              key: 'owner',
              name: 'Responsável',
              value: 'João Pereira',
              defaultHidden: true,
              renderValue: text,
            },
            {
  // … +13 linhas — ver o arquivo da story
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: () => <ControlledExampleRender />,
}
```

**Without Animation**

```tsx
export const WithoutAnimation: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <DataView
        {...args}
        categories={CATEGORIES}
        items={buildItems()}
        defaultExpandedCategories={['general']}
        disableExpandAnimation
      />
    </div>
  ),
}
```

### Dropdown

Visual: `components/Dropdown.html` · stories: `Dropdown.stories.tsx` (12)

```tsx
import { Dropdown, DropdownOption, DropdownDivider } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  notFound: false,
  scrollable: false,
}
```

**Default**

```tsx
export const Default: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption label="Opção 1" leftIcon={<UserIcon />} />
      <DropdownOption label="Opção 2" leftIcon={<UserIcon />} />
      <DropdownOption label="Opção 3" leftIcon={<UserIcon />} />
      <DropdownOption label="Opção 4" leftIcon={<UserIcon />} />
      <DropdownOption label="Opção 5" leftIcon={<UserIcon />} />
    </Dropdown>
  ),
}
```

**With Subtitles**

```tsx
export const WithSubtitles: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption
        label="Marcos Aurélio"
        subtitle="Vendedor Sênior"
        leftImage={AVATAR}
      />
      <DropdownOption
        label="Ana Beatriz"
        subtitle="Gerente Comercial"
        leftImage={AVATAR}
      />
      <DropdownOption
        label="Carlos Eduardo"
        subtitle="Diretor de Vendas"
        leftImage={AVATAR}
      />
    </Dropdown>
  ),
}
```

**With Dividers**

```tsx
export const WithDividers: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption label="Editar" leftIcon={<EditIcon />} />
      <DropdownOption label="Duplicar" leftIcon={<EditIcon />} />
      <DropdownDivider title="Zona de perigo" />
      <DropdownOption label="Excluir" leftIcon={<TrashIcon />} color="danger" />
    </Dropdown>
  ),
}
```

**With Divider No Title**

```tsx
export const WithDividerNoTitle: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption label="Editar" leftIcon={<EditIcon />} />
      <DropdownOption label="Duplicar" leftIcon={<EditIcon />} />
      <DropdownDivider />
      <DropdownOption label="Excluir" leftIcon={<TrashIcon />} color="danger" />
    </Dropdown>
  ),
}
```

**With Right Icon**

```tsx
export const WithRightIcon: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption
        label="Opção 1"
        leftIcon={<UserIcon />}
        rightIcon={<CheckIcon />}
      />
      <DropdownOption label="Opção 2" leftIcon={<UserIcon />} />
      <DropdownOption label="Opção 3" leftIcon={<UserIcon />} />
    </Dropdown>
  ),
}
```

**Colors**

```tsx
export const Colors: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption label="Default" leftIcon={<EditIcon />} color="default" />
      <DropdownOption
        label="Confirmation"
        leftIcon={<CheckIcon />}
        color="confirmation"
      />
      <DropdownOption label="Danger" leftIcon={<TrashIcon />} color="danger" />
    </Dropdown>
  ),
}
```

**With New Option**

```tsx
export const WithNewOption: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption label="Marcos Aurélio" isNew leftIcon={<UserIcon />} />
      <DropdownOption label="Opção 1" leftIcon={<UserIcon />} />
      <DropdownOption label="Opção 2" leftIcon={<UserIcon />} />
    </Dropdown>
  ),
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption label="Opção ativa" leftIcon={<UserIcon />} />
      <DropdownOption
        label="Opção desabilitada"
        leftIcon={<UserIcon />}
        disabled
      />
      <DropdownOption label="Outra ativa" leftIcon={<UserIcon />} />
    </Dropdown>
  ),
}
```

**Not Found**

```tsx
export const NotFound: Story = {
  args: { notFound: true },
  render: (args) => <Dropdown {...args} />,
}
```

**Scrollable**

```tsx
export const Scrollable: Story = {
  args: { scrollable: true },
  render: (args) => (
    <Dropdown {...args}>
      {Array.from({ length: 12 }, (_, i) => (
        <DropdownOption
          key={i}
          label={`Opção ${i + 1}`}
          leftIcon={<UserIcon />}
        />
      ))}
    </Dropdown>
  ),
}
```

**Mixed Left Slots**

```tsx
export const MixedLeftSlots: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <DropdownOption label="Com imagem" leftImage={AVATAR} />
      <DropdownOption label="Com ícone" leftIcon={<UserIcon />} />
      <DropdownOption label="Sem slot esquerdo" />
    </Dropdown>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
          Ícone — default/confirmation/danger
        </p>
        <Dropdown>
          <DropdownOption
            label="Editar"
            leftIcon={<EditIcon />}
            color="default"
          />
          <DropdownOption
            label="Confirmado"
            leftIcon={<CheckIcon />}
            color="confirmation"
  // … +52 linhas — ver o arquivo da story
```

### FooterModal

Visual: `components/FooterModal.html` · stories: `FooterModal.stories.tsx` (9)

```tsx
import { FooterModal } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  actionLabel: 'Confirmar',
  actionColor: 'confirmation',
  spaceBetween: true,
}
```

**Action Only**

```tsx
export const ActionOnly: Story = {
  args: {
    actionLabel: 'Salvar',
    spaceBetween: false,
  },
}
```

**Space Between No Left**

```tsx
export const SpaceBetweenNoLeft: Story = {
  args: {
    actionLabel: 'Salvar',
    spaceBetween: true,
  },
}
```

**With Secondary**

```tsx
export const WithSecondary: Story = {
  args: {
    secondaryLabel: 'Cancelar',
    actionLabel: 'Salvar',
    spaceBetween: true,
  },
}
```

**With Secondary No Space Between**

```tsx
export const WithSecondaryNoSpaceBetween: Story = {
  args: {
    secondaryLabel: 'Cancelar',
    actionLabel: 'Salvar',
    spaceBetween: false,
  },
}
```

**With Text**

```tsx
export const WithText: Story = {
  args: {
    text: '3 itens selecionados',
    actionLabel: 'Aplicar',
    spaceBetween: false,
  },
}
```

**With Text And Secondary**

```tsx
export const WithTextAndSecondary: Story = {
  args: {
    text: '3 itens selecionados',
    secondaryLabel: 'Cancelar',
    actionLabel: 'Aplicar',
    spaceBetween: false,
  },
}
```

**Brand Color**

```tsx
export const BrandColor: Story = {
  args: {
    secondaryLabel: 'Voltar',
    actionLabel: 'Próximo',
    actionColor: 'brand',
    spaceBetween: true,
  },
}
```

**Secondary Only**

```tsx
export const SecondaryOnly: Story = {
  args: {
    secondaryLabel: 'Cancelar',
    spaceBetween: false,
  },
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[
        {
          label: '1 · spaceBetween, no left',
          props: { actionLabel: 'Lorem Ipsum', spaceBetween: true },
        },
        {
          label: '2 · spaceBetween, with secondary',
          props: {
            secondaryLabel: 'Lorem Ipsum',
            actionLabel: 'Lorem Ipsum',
            spaceBetween: true,
          },
        },
        {
          label: '3 · justify-end, action only',
          props: { actionLabel: 'Lorem Ipsum', spaceBetween: false },
        },
        {
          label: '4 · justify-end, secondary + action',
          props: {
            secondaryLabel: 'Lorem Ipsum',
  // … +43 linhas — ver o arquivo da story
```

### HeaderModal

Visual: `components/HeaderModal.html` · stories: `HeaderModal.stories.tsx` (8)

```tsx
import { HeaderModal } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  left: undefined,
  title: 'Lorem Ipsum',
  intercomButton: false,
}
```

**No Left**

```tsx
export const NoLeft: Story = {
  args: { left: undefined },
}
```

**With Text**

```tsx
export const WithText: Story = {
  args: {
    left: 'text',
    title: 'Título do modal',
  },
}
```

**With Button Soft**

```tsx
export const WithButtonSoft: Story = {
  args: {
    left: 'button_soft',
    leftButtons: [{ label: 'Lorem Ipsum', onClick: () => {} }],
  },
}
```

**With 2 Button Soft**

```tsx
export const With2ButtonSoft: Story = {
  args: {
    left: '2_button_soft',
    leftButtons: [
      { label: 'Lorem Ipsum', onClick: () => {} },
      { label: 'Lorem Ipsum', onClick: () => {} },
    ],
  },
}
```

**With Breadcrumbs**

```tsx
export const WithBreadcrumbs: Story = {
  args: {
    left: 'breadcrumbs',
    breadcrumbItems: [
      { label: 'Home', href: '#' },
      { label: 'Módulo', href: '#' },
      { label: 'Página atual' },
    ],
    breadcrumbSize: 'sm',
  },
}
```

**With Intercom Button**

```tsx
export const WithIntercomButton: Story = {
  args: {
    left: 'text',
    title: 'Modal com ajuda',
    intercomButton: true,
    onIntercomClick: () => {},
  },
}
```

**With Right Content**

```tsx
export const WithRightContent: Story = {
  args: {
    left: 'text',
    title: 'Título do modal',
    rightContent: (
      <span
        style={{
          fontSize: 13,
          color: '#8b8595',
          border: '1px dashed rgba(27,16,44,0.1)',
          borderRadius: 4,
          padding: '4px 12px',
        }}
      >
        Conteúdo customizado
      </span>
    ),
  },
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[
        { label: 'null (no left)', props: {} },
        {
          label: 'text',
          props: { left: 'text' as const, title: 'Título do modal' },
        },
        {
          label: 'button_soft',
          props: {
            left: 'button_soft' as const,
            leftButtons: [{ label: 'Lorem Ipsum' }],
          },
        },
        {
          label: '2_button_soft',
          props: {
            left: '2_button_soft' as const,
            leftButtons: [{ label: 'Lorem Ipsum' }, { label: 'Lorem Ipsum' }],
          },
        },
        {
  // … +37 linhas — ver o arquivo da story
```

### Pagination

Visual: `components/Pagination.html` · stories: `Pagination.stories.tsx` (10)

```tsx
import { Pagination } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  page: 1,
  totalPages: 5,
  siblingCount: 1,
}
```

**Few Pages**

```tsx
export const FewPages: Story = {
  render: () => <Demo totalPages={5} />,
}
```

**First Page**

```tsx
export const FirstPage: Story = {
  render: () => <Demo initialPage={1} totalPages={20} />,
}
```

**Middle Page**

```tsx
export const MiddlePage: Story = {
  render: () => <Demo initialPage={10} totalPages={20} />,
}
```

**Last Page**

```tsx
export const LastPage: Story = {
  render: () => <Demo initialPage={20} totalPages={20} />,
}
```

**Left Ellipsis Only**

```tsx
export const LeftEllipsisOnly: Story = {
  render: () => <Demo initialPage={17} totalPages={20} />,
}
```

**Right Ellipsis Only**

```tsx
export const RightEllipsisOnly: Story = {
  render: () => <Demo initialPage={3} totalPages={20} />,
}
```

**Both Ellipses**

```tsx
export const BothEllipses: Story = {
  render: () => <Demo initialPage={10} totalPages={20} />,
}
```

**Wide Siblings**

```tsx
export const WideSiblings: Story = {
  render: () => <Demo initialPage={10} totalPages={20} siblingCount={2} />,
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[
        { label: 'Default (5 pgs, pg 1)', initialPage: 1, totalPages: 5 },
        { label: 'Expanded (20 pgs, pg 1)', initialPage: 1, totalPages: 20 },
        { label: 'Expanded (20 pgs, pg 10)', initialPage: 10, totalPages: 20 },
        { label: 'Expanded (20 pgs, pg 20)', initialPage: 20, totalPages: 20 },
      ].map(({ label, ...props }) => (
        <div key={label}>
          <p style={{ fontSize: 12, color: '#8b8595', marginBottom: 6 }}>
            {label}
          </p>
          <Demo {...props} ariaLabel={`Paginação — ${label}`} />
        </div>
      ))}
    </div>
  ),
}
```

**Interactive**

```tsx
export const Interactive: Story = {
  render: () => <Demo initialPage={1} totalPages={20} />,
}
```

### SearchInput

Visual: `components/SearchInput.html` · stories: `SearchInput.stories.tsx` (9)

```tsx
import { SearchInput } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  size: 'sm',
  placeholder: 'Buscar...',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Size Sm**

```tsx
export const SizeSm: Story = {
  args: { size: 'sm' },
}
```

**Size Md**

```tsx
export const SizeMd: Story = {
  args: { size: 'md' },
}
```

**Size Lg**

```tsx
export const SizeLg: Story = {
  args: { size: 'lg' },
}
```

**With Value**

```tsx
export const WithValue: Story = {
  args: { size: 'sm', defaultValue: 'Lorem Ipsum' },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}
    >
      <SearchInput {...args} size="sm" placeholder="Small (30px)" />
      <SearchInput {...args} size="md" placeholder="Normal (35px)" />
      <SearchInput {...args} size="lg" placeholder="Big (40px)" />
    </div>
  ),
}
```

**All Sizes With Value**

```tsx
export const AllSizesWithValue: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}
    >
      <SearchInput {...args} size="sm" defaultValue="Lorem Ipsum" />
      <SearchInput {...args} size="md" defaultValue="Lorem Ipsum" />
      <SearchInput {...args} size="lg" defaultValue="Lorem Ipsum" />
    </div>
  ),
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 200px)',
        gap: 8,
      }}
    >
      <SearchInput size="sm" placeholder="Small placeholder" />
      <SearchInput size="md" placeholder="Normal placeholder" />
      <SearchInput size="lg" placeholder="Big placeholder" />
      {/* with value (focused ring visible on click) */}
      <SearchInput size="sm" defaultValue="Lorem Ipsum" />
      <SearchInput size="md" defaultValue="Lorem Ipsum" />
      <SearchInput size="lg" defaultValue="Lorem Ipsum" />
    </div>
  ),
}
```

### Skeleton

Visual: `components/Skeleton.html` · stories: `Skeleton.stories.tsx` (6)

```tsx
import { Skeleton } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: { variant: 'rounded', animation: 'pulse', width: 200, height: 100 }
```

**Default**

```tsx
export const Default: Story = {}
```

**Text**

```tsx
export const Text: Story = {
  args: { variant: 'text', width: undefined, height: undefined },
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}
    >
      <Skeleton {...args} />
      <Skeleton {...args} />
      <Skeleton {...args} style={{ width: '60%' }} />
    </div>
  ),
}
```

**Circular**

```tsx
export const Circular: Story = {
  args: { variant: 'circular', width: 48, height: 48 },
}
```

**No Animation**

```tsx
export const NoAnimation: Story = {
  args: { animation: 'none' },
}
```

**Card Placeholder**

```tsx
export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: 320 }}>
      <Skeleton variant="circular" width={48} height={48} />
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
      >
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} style={{ width: '70%' }} />
      </div>
    </div>
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Skeleton variant="rounded" width={120} height={80} />
      <Skeleton variant="circular" width={64} height={64} />
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 160 }}
      >
        <Skeleton variant="text" height={14} />
        <Skeleton variant="text" height={14} style={{ width: '80%' }} />
      </div>
    </div>
  ),
}
```

### SpeechToTextButton

Visual: `components/SpeechToTextButton.html` · stories: `SpeechToTextButton.stories.tsx` (4)

```tsx
import { SpeechToTextButton } from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: function Render(args) {
    const [recording, setRecording] = useState(false);
    return (
      <SpeechToTextButton
        {...args}
        recording={recording}
        onToggle={setRecording}
      />
    );
  },
}
```

**Recording**

```tsx
export const Recording: Story = {
  args: { recording: true },
}
```

**Unsupported**

```tsx
export const Unsupported: Story = {
  args: { unsupported: true },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true },
}
```

### Text

Visual: `components/Text.html` · stories: `Text.stories.tsx` (5)

```tsx
import { Text } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  children: 'The quick brown fox jumps over the lazy dog',
  size: 'normal_14',
  weight: 'regular',
  color: 'default',
}
```

**Playground**

```tsx
export const Playground: Story = {}
```

**Sizes**

```tsx
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {SIZES.map((size) => (
        <Text key={size} size={size}>
          {size} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
}
```

**Weights**

```tsx
export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {WEIGHTS.map((weight) => (
        <Text key={weight} size="big_16" weight={weight}>
          {weight} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
}
```

**Colors**

```tsx
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {COLORS.map((color) => (
        <Text key={color} size="big_16" color={color}>
          {color} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
}
```

**As Headings**

```tsx
export const AsHeadings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text as="h1" size="bigger_18" weight="bold">
        Heading 1
      </Text>
      <Text as="h2" size="big_16" weight="semibold">
        Heading 2
      </Text>
      <Text as="p">Body paragraph with the default size and weight.</Text>
      <Text as="span" size="small_13" color="level_1">
        Inline caption
      </Text>
    </div>
  ),
}
```

### Toaster

Visual: `components/Toaster.html` · stories: `Toaster.stories.tsx` (9)

```tsx
import { Toast, ToasterProvider, useToaster } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  type: 'danger',
  title: 'Lorem Ipsum',
  body: 'Lorem Ipsum',
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: {
    type: 'danger',
    title: 'Erro ao salvar',
    body: 'Tente novamente mais tarde.',
  },
}
```

**Confirmation**

```tsx
export const Confirmation: Story = {
  args: {
    type: 'confirmation',
    title: 'Salvo com sucesso',
    body: 'Suas alterações foram aplicadas.',
  },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: {
    type: 'alert',
    title: 'Atenção',
    body: 'Esta ação não pode ser desfeita.',
  },
}
```

**Info**

```tsx
export const Info: Story = {
  args: {
    type: 'info',
    title: 'Nova mensagem',
    body: 'Você tem uma nova notificação.',
  },
}
```

**With Action**

```tsx
export const WithAction: Story = {
  args: {
    type: 'danger',
    title: 'Falha na conexão',
    body: 'Não foi possível conectar ao servidor.',
    action: { label: 'Tentar novamente', onClick: () => alert('Retry!') },
  },
}
```

**No Body**

```tsx
export const NoBody: Story = {
  args: { type: 'info', title: 'Operação concluída' },
}
```

**All Types**

```tsx
export const AllTypes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <Toast type="danger" title="Lorem Ipsum" body="Lorem Ipsum" />
      <Toast type="confirmation" title="Lorem Ipsum" body="Lorem Ipsum" />
      <Toast type="alert" title="Lorem Ipsum" body="Lorem Ipsum" />
      <Toast type="info" title="Lorem Ipsum" body="Lorem Ipsum" />
    </div>
  ),
}
```

**All Types With Action**

```tsx
export const AllTypesWithAction: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      {(['danger', 'confirmation', 'alert', 'info'] as const).map((type) => (
        <Toast
          key={type}
          type={type}
          title="Lorem Ipsum"
          body="Lorem Ipsum"
          action={{ label: 'Lorem Ipsum', onClick: () => {} }}
        />
      ))}
    </div>
  ),
}
```

**Hook Usage**

```tsx
export const HookUsage: Story = {
  decorators: [
    (Story) => (
      <ToasterProvider>
        <Story />
      </ToasterProvider>
    ),
  ],
  render: () => <HookDemo />,
}
```

## Fields

### Field01TextSimple

Visual: `fields/Field01TextSimple.html` · stories: `Field01TextSimple.stories.tsx` (15)

```tsx
import { Field01TextSimple } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  theme: 'form',
  label: 'Texto simples',
  placeholder: 'Lorem Ipsum',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: 'Lorem Ipsum' },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Lorem Ipsum' },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: 'Lorem Ipsum' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**With Help Text**

```tsx
export const WithHelpText: Story = {
  args: { helpText: 'Texto de ajuda' },
}
```

**With Character Counter**

```tsx
export const WithCharacterCounter: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <Field01TextSimple
        {...args}
        maxLength={200}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
}
```

**With Validation Icons**

```tsx
export const WithValidationIcons: Story = {
  args: {
    required: true,
    isKey: true,
    hasMask: true,
    hasFormula: true,
    hasExternalFormula: true,
    infoMessage: 'Informação sobre o campo',
    alertMessage: 'Atenção a este campo',
    maxLength: 200,
  },
}
```

**Replaceable Right**

```tsx
export const ReplaceableRight: Story = {
  args: {
    replaceableRight: (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 160,
          height: 30,
          border: '1px dashed rgba(27,16,44,0.1)',
          borderRadius: 4,
          background: '#fff',
          fontSize: 14,
          color: 'rgba(27,16,44,0.5)',
        }}
      >
        Replaceable right
      </span>
    ),
  },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field01TextSimple {...args} size="sm" label="Small (30px)" />
      <Field01TextSimple {...args} size="md" label="Normal (35px)" />
      <Field01TextSimple {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Theme**

```tsx
export const CellTheme: Story = {
  args: { theme: 'cell' },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field01TextSimple {...args} theme="cell" placeholder="Neutral" />
      <Field01TextSimple
        {...args}
        theme="cell"
        status="danger"
        placeholder="Danger"
      />
      <Field01TextSimple
        {...args}
        theme="cell"
        status="alert"
        placeholder="Alert"
      />
      <Field01TextSimple
        {...args}
        theme="cell"
        disabled
        placeholder="Disabled"
      />
  // … +9 linhas — ver o arquivo da story
```

**Form Status Matrix**

```tsx
export const FormStatusMatrix: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        width: 640,
      }}
    >
      <Field01TextSimple {...args} label="Neutral" />
      <Field01TextSimple {...args} label="Neutral disabled" disabled />
      <Field01TextSimple
        {...args}
        label="Danger"
        status="danger"
        helpText="Texto de ajuda"
      />
      <Field01TextSimple
        {...args}
        label="Danger disabled"
        status="danger"
        disabled
        helpText="Texto de ajuda"
  // … +17 linhas — ver o arquivo da story
```

### Field02TextEditor

Visual: `fields/Field02TextEditor.html` · stories: `Field02TextEditor.stories.tsx` (9)

```tsx
import { Field02TextEditor } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Texto formatado',
  placeholder: 'Escreva aqui...',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: {
    defaultValue:
      '<div>Lorem ipsum <b>dolor</b> sit amet, <i>consectetur</i> adipiscing elit.</div><ul><li>Item um</li><li>Item dois</li></ul>',
  },
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [html, setHtml] = useState('<div>Edite e veja o HTML abaixo.</div>');
    return (
      <div className="flex flex-col gap-[10px]">
        <Field02TextEditor {...args} value={html} onChange={setHtml} />
        <pre className="overflow-x-auto rounded-[5px] bg-neutral-level_1 p-[10px] text-[12px] text-font-level_1">
          {html}
        </pre>
      </div>
    );
  },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Without Source Button**

```tsx
export const WithoutSourceButton: Story = {
  args: { hideSourceButton: true },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, value: '<div>Lorem <b>Ipsum</b></div>' },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: {
    viewOnly: true,
    value: '<div>Lorem <b>Ipsum</b> com <a href="#">link</a></div>',
  },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

### Field02TextMultiline

Visual: `fields/Field02TextMultiline.html` · stories: `Field02TextMultiline.stories.tsx` (14)

```tsx
import { Field02TextMultiline, SpeechToTextButton } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  theme: 'form',
  label: 'Texto multilinha',
  placeholder: 'Lorem Ipsum',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: {
    defaultValue: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Lorem Ipsum' },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: 'Lorem Ipsum' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**With Character Counter**

```tsx
export const WithCharacterCounter: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <Field02TextMultiline
        {...args}
        maxLength={200}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
}
```

**With Speech To Text**

```tsx
export const WithSpeechToText: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');
    const [recording, setRecording] = useState(false);
    return (
      <Field02TextMultiline
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        replaceableRight={
          <SpeechToTextButton
            recording={recording}
            onToggle={(next) => {
              setRecording(next);
              // Here the application starts/stops recognition (Web Speech API,
              // a custom service, etc.) and writes the transcription to the value.
            }}
          />
        }
      />
    );
  },
}
```

**Without Resize**

```tsx
export const WithoutResize: Story = {
  args: { allowResize: false, defaultValue: 'Lorem Ipsum' },
}
```

**With Validation Icons**

```tsx
export const WithValidationIcons: Story = {
  args: {
    required: true,
    hasFormula: true,
    infoMessage: 'Informação sobre o campo',
    maxLength: 200,
  },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field02TextMultiline {...args} size="sm" label="Small (30px)" />
      <Field02TextMultiline {...args} size="md" label="Normal (35px)" />
      <Field02TextMultiline {...args} size="lg" label="Big (40px)" />
      <Field02TextMultiline {...args} size="xl" label="Fixed (60px)" />
    </div>
  ),
}
```

**Cell Theme** · _inclui captura do estado aberto no HTML_

```tsx
export const CellTheme: Story = {
  args: { theme: 'cell', label: 'Título do campo' },
  decorators: [
    (Story) => (
      <div style={{ width: 200, height: 280 }}>
        <Story />
      </div>
    ),
  ],
}
```

**Cell Statuses** · _inclui captura do estado aberto no HTML_

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: 200,
        paddingBottom: 240,
      }}
    >
      <Field02TextMultiline
        {...args}
        theme="cell"
        label="Neutral"
        placeholder="Neutral"
      />
      <Field02TextMultiline
        {...args}
        theme="cell"
        label="Danger"
        status="danger"
        placeholder="Danger"
      />
  // … +24 linhas — ver o arquivo da story
```

### Field04NumberInteger

Visual: `fields/Field04NumberInteger.html` · stories: `Field04NumberInteger.stories.tsx` (12)

```tsx
import { Field04NumberInteger } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  theme: 'form',
  label: 'Número inteiro',
  placeholder: '0',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: '1234' },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: '1234' },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: '1234' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**With Min Max**

```tsx
export const WithMinMax: Story = {
  args: {
    min: 0,
    max: 100,
    helpText: 'Entre 0 e 100 (aplicado ao sair do campo)',
  },
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('42');
    return (
      <Field04NumberInteger
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
}
```

**With Validation Icons**

```tsx
export const WithValidationIcons: Story = {
  args: {
    required: true,
    hasFormula: true,
    infoMessage: 'Informação sobre o campo',
  },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field04NumberInteger {...args} size="sm" label="Small (30px)" />
      <Field04NumberInteger {...args} size="md" label="Normal (35px)" />
      <Field04NumberInteger {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field04NumberInteger {...args} theme="cell" placeholder="Neutral" />
      <Field04NumberInteger
        {...args}
        theme="cell"
        status="danger"
        placeholder="Danger"
      />
      <Field04NumberInteger
        {...args}
        theme="cell"
        status="alert"
        placeholder="Alert"
      />
      <Field04NumberInteger
        {...args}
        theme="cell"
        disabled
        placeholder="Disabled"
      />
  // … +9 linhas — ver o arquivo da story
```

### Field05NumberCurrency

Visual: `fields/Field05NumberCurrency.html` · stories: `Field05NumberCurrency.stories.tsx` (12)

```tsx
import { Field05NumberCurrency } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  theme: 'form',
  label: 'Valor',
  placeholder: '0,00',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: 1234.56 },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 1234.56 },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: 1234.56 },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<number | null>(42);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Field05NumberCurrency
          {...args}
          value={value}
          onValueChange={setValue}
        />
        <span style={{ fontSize: 13, color: '#8b8595' }}>
          Valor numérico: {value ?? 'null'}
        </span>
      </div>
    );
  },
}
```

**No Decimals**

```tsx
export const NoDecimals: Story = {
  args: { decimalPlaces: 0, placeholder: '0', helpText: 'decimalPlaces={0}' },
}
```

**With Validation Icons**

```tsx
export const WithValidationIcons: Story = {
  args: {
    required: true,
    hasFormula: true,
    infoMessage: 'Informação sobre o campo',
  },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field05NumberCurrency {...args} size="sm" label="Small (30px)" />
      <Field05NumberCurrency {...args} size="md" label="Normal (35px)" />
      <Field05NumberCurrency {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field05NumberCurrency {...args} theme="cell" placeholder="Neutral" />
      <Field05NumberCurrency
        {...args}
        theme="cell"
        status="danger"
        placeholder="Danger"
      />
      <Field05NumberCurrency
        {...args}
        theme="cell"
        status="alert"
        placeholder="Alert"
      />
      <Field05NumberCurrency
        {...args}
        theme="cell"
        disabled
        placeholder="Disabled"
      />
  // … +9 linhas — ver o arquivo da story
```

### Field06NumberDouble

Visual: `fields/Field06NumberDouble.html` · stories: `Field06NumberDouble.stories.tsx` (12)

```tsx
import { Field06NumberDouble } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  theme: 'form',
  label: 'Número decimal',
  placeholder: '0,00',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: 3.1415 },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3.1415 },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: 3.1415 },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<number | null>(2.5);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Field06NumberDouble {...args} value={value} onValueChange={setValue} />
        <span style={{ fontSize: 13, color: '#8b8595' }}>
          Valor numérico: {value ?? 'null'}
        </span>
      </div>
    );
  },
}
```

**Max Two Decimals**

```tsx
export const MaxTwoDecimals: Story = {
  args: { maxDecimalPlaces: 2, helpText: 'maxDecimalPlaces={2}' },
}
```

**With Validation Icons**

```tsx
export const WithValidationIcons: Story = {
  args: {
    required: true,
    hasFormula: true,
    infoMessage: 'Informação sobre o campo',
  },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field06NumberDouble {...args} size="sm" label="Small (30px)" />
      <Field06NumberDouble {...args} size="md" label="Normal (35px)" />
      <Field06NumberDouble {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field06NumberDouble {...args} theme="cell" placeholder="Neutral" />
      <Field06NumberDouble
        {...args}
        theme="cell"
        status="danger"
        placeholder="Danger"
      />
      <Field06NumberDouble
        {...args}
        theme="cell"
        status="alert"
        placeholder="Alert"
      />
      <Field06NumberDouble
        {...args}
        theme="cell"
        disabled
        placeholder="Disabled"
      />
  // … +9 linhas — ver o arquivo da story
```

### Field07Options

Visual: `fields/Field07Options.html` · stories: `Field07Options.stories.tsx` (14)

```tsx
import { Field07Options, Icon, type FieldOptionValue } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  theme: 'form',
  label: 'Opções',
  placeholder: 'Selecione',
  options: OPTIONS,
}
```

**Default** · _inclui captura do estado aberto no HTML_

```tsx
export const Default: Story = {}
```

**Single Selected** · _inclui captura do estado aberto no HTML_

```tsx
export const SingleSelected: Story = {
  args: { defaultValue: 2 },
}
```

**Multiple** · _inclui captura do estado aberto no HTML_

```tsx
export const Multiple: Story = {
  args: { multiple: true },
}
```

**Multiple Selected** · _inclui captura do estado aberto no HTML_

```tsx
export const MultipleSelected: Story = {
  args: { multiple: true, defaultValue: [1, 2, 4] },
}
```

**Tag Chips** · _inclui captura do estado aberto no HTML_

```tsx
export const TagChips: Story = {
  args: {
    multiple: true,
    options: [
      {
        value: 'a',
        label: 'Tag A',
        tag: true,
        icon: <Icon icon={Tag} size="tiny_10" />,
      },
      {
        value: 'b',
        label: 'Tag B',
        tag: true,
        icon: <Icon icon={Tag} size="tiny_10" />,
      },
      { value: 'c', label: 'Sem tag' },
    ],
    defaultValue: ['a', 'b'],
  },
}
```

**Deleted Option** · _inclui captura do estado aberto no HTML_

```tsx
export const DeletedOption: Story = {
  args: {
    options: [
      ...OPTIONS,
      { value: 99, label: 'Opção deletada', deleted: true },
    ],
    defaultValue: 99,
  },
}
```

**Danger** · _inclui captura do estado aberto no HTML_

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert** · _inclui captura do estado aberto no HTML_

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, multiple: true, defaultValue: [1, 2] },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, multiple: true, defaultValue: [1, 2] },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**Controlled** · _inclui captura do estado aberto no HTML_

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<FieldOptionValue[]>([1]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Field07Options
          {...args}
          multiple
          value={value}
          onValueChange={(v) => setValue(v as FieldOptionValue[])}
        />
        <span style={{ fontSize: 13, color: '#8b8595' }}>
          Selecionados: {JSON.stringify(value)}
        </span>
      </div>
    );
  },
}
```

**All Sizes** · _inclui captura do estado aberto no HTML_

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field07Options
        {...args}
        size="sm"
        label="Small (30px)"
        defaultValue={1}
      />
      <Field07Options
        {...args}
        size="md"
        label="Normal (35px)"
        defaultValue={1}
      />
      <Field07Options {...args} size="lg" label="Big (40px)" defaultValue={1} />
    </div>
  ),
}
```

**Cell Statuses** · _inclui captura do estado aberto no HTML_

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field07Options {...args} theme="cell" placeholder="Neutral" />
      <Field07Options
        {...args}
        theme="cell"
        status="danger"
        placeholder="Danger"
      />
      <Field07Options
        {...args}
        theme="cell"
        status="alert"
        placeholder="Alert"
      />
      <Field07Options {...args} theme="cell" disabled placeholder="Disabled" />
      <Field07Options
        {...args}
        theme="cell"
        viewOnly
        multiple
  // … +5 linhas — ver o arquivo da story
```

### Field07Phone

Visual: `fields/Field07Phone.html` · stories: `Field07Phone.stories.tsx` (11)

```tsx
import { Field07Phone, type PhoneValue } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Telefone',
}
```

**Default** · _inclui captura do estado aberto no HTML_

```tsx
export const Default: Story = {}
```

**Filled** · _inclui captura do estado aberto no HTML_

```tsx
export const Filled: Story = {
  args: {
    defaultValue: {
      number: '11999999999',
      mask: 'br-mobile',
      type: 'Comercial',
    },
  },
}
```

**With Add Button** · _inclui captura do estado aberto no HTML_

```tsx
export const WithAddButton: Story = {
  args: {
    defaultValue: { number: '11999999999', mask: 'br-mobile' },
    onAddPhone: () => {},
  },
}
```

**Multiple** · _inclui captura do estado aberto no HTML_

```tsx
export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: [
      { number: '11999999999', mask: 'br-mobile', type: 'Comercial' },
      { number: '1133334444', mask: 'br-landline', type: 'Residencial' },
      { number: '5551234567', mask: 'none', type: 'Celular' },
    ],
  },
}
```

**Multiple Controlled** · _inclui captura do estado aberto no HTML_

```tsx
export const MultipleControlled: Story = {
  render: function Render(args) {
    const [phones, setPhones] = useState<PhoneValue[]>([
      { number: '11999999999', mask: 'br-mobile', type: 'Comercial' },
    ]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Field07Phone
          {...args}
          multiple
          value={phones}
          onValueChange={(v) => setPhones(v as PhoneValue[])}
        />
        <pre style={{ fontSize: 11, color: '#8b8595' }}>
          {JSON.stringify(phones, null, 1)}
        </pre>
      </div>
    );
  },
}
```

**Danger** · _inclui captura do estado aberto no HTML_

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert** · _inclui captura do estado aberto no HTML_

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: { number: '11999999999', mask: 'br-mobile' },
  },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: {
    viewOnly: true,
    defaultValue: { number: '11999999999', mask: 'br-mobile' },
  },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**All Sizes** · _inclui captura do estado aberto no HTML_

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field07Phone {...args} size="sm" label="Small (30px)" />
      <Field07Phone {...args} size="md" label="Normal (35px)" />
      <Field07Phone {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

### Field08Date

Visual: `fields/Field08Date.html` · stories: `Field08Date.stories.tsx` (14)

```tsx
import { Field08Date, type Field08DateRelativeValue } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  dateType: 'fixed',
  label: 'Data',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: '27/03/2002' },
}
```

**Relative** · _inclui captura do estado aberto no HTML_

```tsx
export const Relative: Story = {
  args: { dateType: 'relative' },
}
```

**Relative With Amount** · _inclui captura do estado aberto no HTML_

```tsx
export const RelativeWithAmount: Story = {
  args: {
    dateType: 'relative',
    defaultRelativeValue: { option: 'last-n-weeks', amount: 4 },
  },
}
```

**Relative Controlled** · _inclui captura do estado aberto no HTML_

```tsx
export const RelativeControlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<Field08DateRelativeValue>({
      option: 'today',
    });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Field08Date
          {...args}
          dateType="relative"
          relativeValue={value}
          onRelativeValueChange={setValue}
        />
        <span style={{ fontSize: 13, color: '#8b8595' }}>
          {JSON.stringify(value)}
        </span>
      </div>
    );
  },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: '27/03/2002' },
}
```

**Disabled Relative**

```tsx
export const DisabledRelative: Story = {
  args: { dateType: 'relative', disabled: true },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: '27/03/2002' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**Loading Relative**

```tsx
export const LoadingRelative: Story = {
  args: { dateType: 'relative', loading: true },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field08Date {...args} size="sm" label="Small (30px)" />
      <Field08Date {...args} size="md" label="Normal (35px)" />
      <Field08Date {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field08Date {...args} theme="cell" />
      <Field08Date {...args} theme="cell" status="danger" />
      <Field08Date {...args} theme="cell" status="alert" />
      <Field08Date {...args} theme="cell" disabled />
      <Field08Date {...args} theme="cell" viewOnly defaultValue="27/03/2002" />
    </div>
  ),
}
```

### Field09Time

Visual: `fields/Field09Time.html` · stories: `Field09Time.stories.tsx` (9)

```tsx
import { Field09Time } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Hora',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: '10:30' },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: '10:30' },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: '10:30' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field09Time {...args} size="sm" label="Small (30px)" />
      <Field09Time {...args} size="md" label="Normal (35px)" />
      <Field09Time {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field09Time {...args} theme="cell" />
      <Field09Time {...args} theme="cell" status="danger" />
      <Field09Time {...args} theme="cell" status="alert" />
      <Field09Time {...args} theme="cell" disabled />
      <Field09Time {...args} theme="cell" viewOnly defaultValue="10:30" />
    </div>
  ),
}
```

### Field10Checkbox

Visual: `fields/Field10Checkbox.html` · stories: `Field10Checkbox.stories.tsx` (16)

```tsx
import { Field10Checkbox, ToggleSwitch } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Ativo',
  placeholder: 'Selecione',
}
```

**Default** · _inclui captura do estado aberto no HTML_

```tsx
export const Default: Story = {}
```

**Filled True** · _inclui captura do estado aberto no HTML_

```tsx
export const FilledTrue: Story = {
  args: { defaultValue: true },
}
```

**Filled False** · _inclui captura do estado aberto no HTML_

```tsx
export const FilledFalse: Story = {
  args: { defaultValue: false },
}
```

**Toggle**

```tsx
export const Toggle: Story = {
  args: { toggleSwitch: true },
}
```

**Toggle On**

```tsx
export const ToggleOn: Story = {
  args: { toggleSwitch: true, defaultValue: true },
}
```

**Toggle Disabled**

```tsx
export const ToggleDisabled: Story = {
  args: { toggleSwitch: true, disabled: true, defaultValue: true },
}
```

**Custom Labels** · _inclui captura do estado aberto no HTML_

```tsx
export const CustomLabels: Story = {
  args: { trueLabel: 'Ligado', falseLabel: 'Desligado', defaultValue: true },
}
```

**Danger** · _inclui captura do estado aberto no HTML_

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert** · _inclui captura do estado aberto no HTML_

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: true },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: true },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**Controlled** · _inclui captura do estado aberto no HTML_

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<boolean | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Field10Checkbox {...args} value={value} onValueChange={setValue} />
        <span style={{ fontSize: 13, color: '#8b8595' }}>
          Valor: {String(value)}
        </span>
      </div>
    );
  },
}
```

**Toggle Sizes**

```tsx
export const ToggleSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <ToggleSwitch aria-label="Pequeno" size="sm" />
      <ToggleSwitch aria-label="Médio" size="md" />
      <ToggleSwitch aria-label="Grande" size="lg" />
      <ToggleSwitch aria-label="Pequeno ligado" size="sm" checked />
      <ToggleSwitch aria-label="Médio ligado" size="md" checked />
      <ToggleSwitch aria-label="Grande ligado" size="lg" checked />
    </div>
  ),
}
```

**All Sizes** · _inclui captura do estado aberto no HTML_

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field10Checkbox {...args} size="sm" label="Small (30px)" />
      <Field10Checkbox {...args} size="md" label="Normal (35px)" />
      <Field10Checkbox {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses** · _inclui captura do estado aberto no HTML_

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field10Checkbox {...args} theme="cell" />
      <Field10Checkbox {...args} theme="cell" status="danger" />
      <Field10Checkbox {...args} theme="cell" status="alert" />
      <Field10Checkbox {...args} theme="cell" disabled />
      <Field10Checkbox {...args} theme="cell" viewOnly defaultValue />
      <Field10Checkbox {...args} theme="cell" toggleSwitch defaultValue />
    </div>
  ),
}
```

### Field11CPF

Visual: `fields/Field11CPF.html` · stories: `Field11CPF.stories.tsx` (10)

```tsx
import { Field11CPF } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'CPF',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: '00000000000' },
}
```

**With Validation**

```tsx
export const WithValidation: Story = {
  render: function Render(args) {
    const [cpf, setCpf] = useState<string | null>(null);
    const [display, setDisplay] = useState('');
    const complete = display.replace(/\D/g, '').length === 11;
    return (
      <Field11CPF
        {...args}
        status={complete && cpf == null ? 'danger' : 'neutral'}
        helpText={
          complete && cpf == null ? 'CPF inválido' : 'Digite os 11 dígitos'
        }
        onValueChange={(d, v) => {
          setDisplay(d);
          setCpf(v);
        }}
      />
    );
  },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'CPF inválido' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: '00000000000' },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: '00000000000' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field11CPF {...args} size="sm" label="Small (30px)" />
      <Field11CPF {...args} size="md" label="Normal (35px)" />
      <Field11CPF {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field11CPF {...args} theme="cell" />
      <Field11CPF {...args} theme="cell" status="danger" />
      <Field11CPF {...args} theme="cell" status="alert" />
      <Field11CPF {...args} theme="cell" disabled />
      <Field11CPF {...args} theme="cell" viewOnly defaultValue="00000000000" />
    </div>
  ),
}
```

### Field12CNPJ

Visual: `fields/Field12CNPJ.html` · stories: `Field12CNPJ.stories.tsx` (14)

```tsx
import { Field12CNPJ, ReceitaFederalButton } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'CNPJ',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: '11222333000181' },
}
```

**With Receita Federal**

```tsx
export const WithReceitaFederal: Story = {
  args: { onReceitaFederalClick: () => {} },
}
```

**Receita Federal Active**

```tsx
export const ReceitaFederalActive: Story = {
  args: {
    defaultValue: '11222333000181',
    onReceitaFederalClick: () => {},
    receitaFederalActive: true,
  },
}
```

**Receita Federal Loading**

```tsx
export const ReceitaFederalLoading: Story = {
  args: {
    defaultValue: '11222333000181',
    onReceitaFederalClick: () => {},
    receitaFederalLoading: true,
  },
}
```

**Receita Federal Flow**

```tsx
export const ReceitaFederalFlow: Story = {
  render: function Render(args) {
    const [active, setActive] = useState(false);
    const [busy, setBusy] = useState(false);
    return (
      <Field12CNPJ
        {...args}
        defaultValue="11222333000181"
        receitaFederalActive={active}
        receitaFederalLoading={busy}
        onReceitaFederalClick={() => {
          if (active) {
            setActive(false);
            return;
          }
          setBusy(true);
          setTimeout(() => {
            setBusy(false);
            setActive(true);
          }, 1500);
        }}
      />
    );
  },
  // … +1 linhas — ver o arquivo da story
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'CNPJ inválido' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '11222333000181',
    onReceitaFederalClick: () => {},
  },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: '11222333000181' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**Button States**

```tsx
export const ButtonStates: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <ReceitaFederalButton size="sm" />
      <ReceitaFederalButton size="md" />
      <ReceitaFederalButton size="lg" />
      <ReceitaFederalButton size="md" active />
      <ReceitaFederalButton size="md" loading />
    </div>
  ),
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field12CNPJ
        {...args}
        size="sm"
        label="Small (30px)"
        onReceitaFederalClick={() => {}}
      />
      <Field12CNPJ
        {...args}
        size="md"
        label="Normal (35px)"
        onReceitaFederalClick={() => {}}
      />
      <Field12CNPJ
        {...args}
        size="lg"
        label="Big (40px)"
        onReceitaFederalClick={() => {}}
      />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 220 }}
    >
      <Field12CNPJ {...args} theme="cell" />
      <Field12CNPJ {...args} theme="cell" status="danger" />
      <Field12CNPJ {...args} theme="cell" status="alert" />
      <Field12CNPJ {...args} theme="cell" disabled />
      <Field12CNPJ
        {...args}
        theme="cell"
        viewOnly
        defaultValue="11222333000181"
      />
    </div>
  ),
}
```

### Field13NumberPercentage

Visual: `fields/Field13NumberPercentage.html` · stories: `Field13NumberPercentage.stories.tsx` (11)

```tsx
import { Field13NumberPercentage } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Desconto',
  placeholder: '0',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: 10 },
}
```

**Decimal**

```tsx
export const Decimal: Story = {
  args: { defaultValue: 12.5 },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 10 },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: 10 },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<number | null>(10);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Field13NumberPercentage
          {...args}
          value={value}
          onValueChange={setValue}
        />
        <span style={{ fontSize: 13, color: '#8b8595' }}>
          Valor numérico: {value ?? 'null'}
        </span>
      </div>
    );
  },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field13NumberPercentage {...args} size="sm" label="Small (30px)" />
      <Field13NumberPercentage {...args} size="md" label="Normal (35px)" />
      <Field13NumberPercentage {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field13NumberPercentage {...args} theme="cell" />
      <Field13NumberPercentage {...args} theme="cell" status="danger" />
      <Field13NumberPercentage {...args} theme="cell" status="alert" />
      <Field13NumberPercentage {...args} theme="cell" disabled />
      <Field13NumberPercentage
        {...args}
        theme="cell"
        viewOnly
        defaultValue={10}
      />
    </div>
  ),
}
```

### Field17Address

Visual: `fields/Field17Address.html` · stories: `Field17Address.stories.tsx` (10)

```tsx
import { Field17Address } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Endereço',
  placeholder: 'Lorem Ipsum',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: 'Rua Exemplo, 100 - Centro, São Paulo' },
}
```

**With Location Action**

```tsx
export const WithLocationAction: Story = {
  args: {
    defaultValue: 'Rua Exemplo, 100 - Centro, São Paulo',
    onLocationClick: () => {},
  },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Rua Exemplo, 100 - Centro' },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: 'Rua Exemplo, 100 - Centro' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field17Address {...args} size="sm" label="Small (30px)" />
      <Field17Address {...args} size="md" label="Normal (35px)" />
      <Field17Address {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field17Address {...args} theme="cell" />
      <Field17Address {...args} theme="cell" status="danger" />
      <Field17Address {...args} theme="cell" status="alert" />
      <Field17Address {...args} theme="cell" disabled />
      <Field17Address
        {...args}
        theme="cell"
        viewOnly
        defaultValue="Rua Exemplo, 100"
      />
    </div>
  ),
}
```

### Field18Image

Visual: `fields/Field18Image.html` · stories: `Field18Image.stories.tsx` (9)

```tsx
import { Field18Image } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Imagem',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: URL_SAMPLE },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: URL_SAMPLE },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: URL_SAMPLE },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field18Image {...args} size="sm" label="Small (30px)" />
      <Field18Image {...args} size="md" label="Normal (35px)" />
      <Field18Image {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Theme**

```tsx
export const CellTheme: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}
    >
      <Field18Image {...args} theme="cell" />
      <Field18Image {...args} theme="cell" defaultValue={URL_SAMPLE} />
      <Field18Image {...args} theme="cell" status="danger" />
      <Field18Image {...args} theme="cell" disabled />
      <Field18Image {...args} theme="cell" viewOnly defaultValue={URL_SAMPLE} />
    </div>
  ),
}
```

### Field19Attachment

Visual: `fields/Field19Attachment.html` · stories: `Field19Attachment.stories.tsx` (11)

```tsx
import { Field19Attachment } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Anexos',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Multiple**

```tsx
export const Multiple: Story = {
  args: { multiple: true },
}
```

**Filled Single**

```tsx
export const FilledSingle: Story = {
  args: {
    defaultFiles: [{ id: 1, name: 'contrato-de-prestacao-de-servicos.pdf' }],
  },
}
```

**Filled Multiple**

```tsx
export const FilledMultiple: Story = {
  args: {
    multiple: true,
    defaultFiles: [
      { id: 1, name: 'contrato.pdf' },
      { id: 2, name: 'proposta.docx' },
      { id: 3, name: 'planilha-de-precos.xlsx' },
      { id: 4, name: 'apresentacao.pptx' },
      { id: 5, name: 'logo.png' },
      { id: 6, name: 'backup.zip' },
    ],
  },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: {
    disabled: true,
    multiple: true,
    defaultFiles: [{ id: 1, name: 'contrato.pdf' }],
  },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: {
    viewOnly: true,
    multiple: true,
    defaultFiles: [{ id: 1, name: 'contrato.pdf' }],
  },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field19Attachment {...args} size="sm" label="Small (30px)" />
      <Field19Attachment {...args} size="md" label="Normal (35px)" />
      <Field19Attachment {...args} size="lg" label="Big (40px)" />
    </div>
  ),
}
```

**Cell Theme**

```tsx
export const CellTheme: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}
    >
      <Field19Attachment {...args} theme="cell" />
      <Field19Attachment
        {...args}
        theme="cell"
        multiple
        defaultFiles={[
          { id: 1, name: 'contrato.pdf' },
          { id: 2, name: 'proposta.docx' },
        ]}
      />
      <Field19Attachment {...args} theme="cell" disabled />
    </div>
  ),
}
```

### Field20Color

Visual: `fields/Field20Color.html` · stories: `Field20Color.stories.tsx` (13)

```tsx
import { Field20Color } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  label: 'Cor',
  placeholder: 'Lorem Ipsum',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Filled**

```tsx
export const Filled: Story = {
  args: { defaultValue: '#6759C0' },
}
```

**Button Only**

```tsx
export const ButtonOnly: Story = {
  args: { buttonOnly: true },
}
```

**Button Only Filled**

```tsx
export const ButtonOnlyFilled: Story = {
  args: { buttonOnly: true, defaultValue: '#6759C0' },
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: function Render(args) {
    const [color, setColor] = useState<string | null>('#7E33E6');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Field20Color
          {...args}
          value={color ?? ''}
          onValueChange={(_, parsed) => setColor(parsed)}
        />
        <span style={{ fontSize: 13, color: '#8b8595' }}>
          Cor: {color ?? 'null'}
        </span>
      </div>
    );
  },
}
```

**Danger**

```tsx
export const Danger: Story = {
  args: { status: 'danger', helpText: 'Texto de ajuda' },
}
```

**Alert**

```tsx
export const Alert: Story = {
  args: { status: 'alert', helpText: 'Texto de ajuda' },
}
```

**Disabled**

```tsx
export const Disabled: Story = {
  args: { disabled: true, defaultValue: '#6759C0' },
}
```

**View Only**

```tsx
export const ViewOnly: Story = {
  args: { viewOnly: true, defaultValue: '#6759C0' },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field20Color
        {...args}
        size="sm"
        label="Small (30px)"
        defaultValue="#6759C0"
      />
      <Field20Color
        {...args}
        size="md"
        label="Normal (35px)"
        defaultValue="#6759C0"
      />
      <Field20Color
        {...args}
        size="lg"
        label="Big (40px)"
        defaultValue="#6759C0"
      />
    </div>
  ),
}
```

**Button Only Sizes**

```tsx
export const ButtonOnlySizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      <Field20Color
        {...args}
        buttonOnly
        size="sm"
        label="30px"
        defaultValue="#6759C0"
        wrapperClassName="w-auto"
      />
      <Field20Color
        {...args}
        buttonOnly
        size="md"
        label="35px"
        defaultValue="#6759C0"
        wrapperClassName="w-auto"
      />
      <Field20Color
        {...args}
        buttonOnly
        size="lg"
        label="40px"
  // … +6 linhas — ver o arquivo da story
```

**Cell Statuses**

```tsx
export const CellStatuses: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}
    >
      <Field20Color {...args} theme="cell" />
      <Field20Color {...args} theme="cell" status="danger" />
      <Field20Color {...args} theme="cell" status="alert" />
      <Field20Color {...args} theme="cell" disabled />
      <Field20Color {...args} theme="cell" viewOnly defaultValue="#6759C0" />
    </div>
  ),
}
```

### Field22Developer

Visual: `fields/Field22Developer.html` · stories: `Field22Developer.stories.tsx` (6)

```tsx
import { Field22Developer } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  theme: 'form',
  label: 'Campo de desenvolvedor',
  value: SAMPLE_HTML,
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Tall Content**

```tsx
export const TallContent: Story = {
  args: { value: TALL_HTML },
}
```

**Tall Content Expanded**

```tsx
export const TallContentExpanded: Story = {
  args: { value: TALL_HTML, defaultExpanded: true },
}
```

**With Validation Icons**

```tsx
export const WithValidationIcons: Story = {
  args: {
    required: true,
    hasFormula: true,
    infoMessage: 'Informação sobre o campo',
  },
}
```

**Loading**

```tsx
export const Loading: Story = {
  args: { loading: true },
}
```

**Cell Theme** · _inclui captura do estado aberto no HTML_

```tsx
export const CellTheme: Story = {
  args: { theme: 'cell' },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
}
```

## Organisms

### ActionDock

Visual: `organisms/ActionDock.html` · stories: `ActionDock.stories.tsx` (5)

```tsx
import { ActionDock } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  selectedCount: 0,
  totalCount: 10,
  entityName: 'cadastros',
  allSelected: false,
}
```

**Default**

```tsx
export const Default: Story = {
  render: (args) => <ActionDock {...args} actions={defaultActions} />,
}
```

**Some Selected**

```tsx
export const SomeSelected: Story = {
  render: (args) => (
    <ActionDock
      {...args}
      selectedCount={3}
      totalCount={10}
      entityName="cadastros"
      allSelected={false}
      actions={defaultActions}
    />
  ),
}
```

**All Selected**

```tsx
export const AllSelected: Story = {
  render: (args) => (
    <ActionDock
      {...args}
      selectedCount={10}
      totalCount={10}
      entityName="cadastros"
      allSelected={true}
      actions={defaultActions}
    />
  ),
}
```

**Interactive**

```tsx
export const Interactive: Story = {
  render: () => <InteractiveDemo />,
}
```

**Both States**

```tsx
export const BothStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <p style={{ fontSize: 11, color: '#8b8595', marginBottom: 4 }}>
          allSelected=false
        </p>
        <ActionDock
          selectedCount={0}
          totalCount={10}
          entityName="cadastros"
          allSelected={false}
          actions={defaultActions}
        />
      </div>
      <div>
        <p style={{ fontSize: 11, color: '#8b8595', marginBottom: 4 }}>
          allSelected=true
        </p>
        <ActionDock
          selectedCount={10}
          totalCount={10}
          entityName="cadastros"
          allSelected={true}
  // … +6 linhas — ver o arquivo da story
```

### AlertModal

Visual: `organisms/AlertModal.html` · stories: `AlertModal.stories.tsx` (7)

```tsx
import { AlertModal } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  open: true,
  title: 'Atenção!',
  body: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
}
```

**Primary And Secondary** · _inclui captura do estado aberto no HTML_

```tsx
export const PrimaryAndSecondary: Story = {
  render: () => (
    <Demo>
      {(open, setOpen) => (
        <AlertModal
          open={open}
          onClose={() => setOpen(false)}
          title="Atenção!"
          body="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
          secondaryAction={{ label: 'Cancelar', onClick: () => setOpen(false) }}
          primaryAction={{ label: 'Confirmar', onClick: () => setOpen(false) }}
        />
      )}
    </Demo>
  ),
}
```

**All Three Buttons** · _inclui captura do estado aberto no HTML_

```tsx
export const AllThreeButtons: Story = {
  render: () => (
    <Demo>
      {(open, setOpen) => (
        <AlertModal
          open={open}
          onClose={() => setOpen(false)}
          title="Atenção!"
          body="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
          cancelAction={{ label: 'Voltar', onClick: () => setOpen(false) }}
          secondaryAction={{ label: 'Cancelar', onClick: () => setOpen(false) }}
          primaryAction={{ label: 'Confirmar', onClick: () => setOpen(false) }}
        />
      )}
    </Demo>
  ),
}
```

**Primary Only** · _inclui captura do estado aberto no HTML_

```tsx
export const PrimaryOnly: Story = {
  render: () => (
    <Demo>
      {(open, setOpen) => (
        <AlertModal
          open={open}
          onClose={() => setOpen(false)}
          title="Operação concluída"
          body="Suas alterações foram salvas com sucesso."
          primaryAction={{ label: 'Ok', onClick: () => setOpen(false) }}
        />
      )}
    </Demo>
  ),
}
```

**Destructive Action** · _inclui captura do estado aberto no HTML_

```tsx
export const DestructiveAction: Story = {
  render: () => (
    <Demo>
      {(open, setOpen) => (
        <AlertModal
          open={open}
          onClose={() => setOpen(false)}
          title="Excluir cadastro?"
          body="Esta ação não pode ser desfeita. O cadastro será permanentemente removido."
          cancelAction={{ label: 'Cancelar', onClick: () => setOpen(false) }}
          primaryAction={{
            label: 'Excluir',
            color: 'confirmation',
            onClick: () => setOpen(false),
          }}
        />
      )}
    </Demo>
  ),
}
```

**Long Content** · _inclui captura do estado aberto no HTML_

```tsx
export const LongContent: Story = {
  render: () => (
    <Demo>
      {(open, setOpen) => (
        <AlertModal
          open={open}
          onClose={() => setOpen(false)}
          title="Termos de uso atualizados"
          body={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in
                venenatis ligula.
              </p>
              <p>
                Proin sodales ante massa, venenatis hendrerit velit pharetra et.
                Aenean pretium lorem ac urna sagittis consectetur.
              </p>
              <p>
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </p>
            </div>
          }
  // … +7 linhas — ver o arquivo da story
```

**No Buttons** · _inclui captura do estado aberto no HTML_

```tsx
export const NoButtons: Story = {
  render: () => (
    <Demo>
      {(open, setOpen) => (
        <AlertModal
          open={open}
          onClose={() => setOpen(false)}
          title="Informação"
          body="Clique fora do modal ou pressione Escape para fechar."
        />
      )}
    </Demo>
  ),
}
```

**Static Preview**

```tsx
export const StaticPreview: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        height: 400,
        background: 'rgba(76,85,102,0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 50,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 5,
          padding: 20,
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow:
  // … +61 linhas — ver o arquivo da story
```

### Card

Visual: `organisms/Card.html` · stories: `Card.stories.tsx` (13)

```tsx
import { Card, ButtonSoft, Badge } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  orientation: 'vertical',
  size: 'normal',
  overHeader: false,
  clickable: true,
  contentRatio: '16:9',
  title: 'Card Title',
  subtitle: 'Descrição resumida do item exibido neste card.',
}
```

**Vertical Default**

```tsx
export const VerticalDefault: Story = {
  render: (args) => (
    <Card
      {...args}
      media={<SampleImage />}
      headerTitle="Card Header"
      headerActions={<CogButton />}
      footer={<FooterButtons />}
    />
  ),
}
```

**Vertical No Header**

```tsx
export const VerticalNoHeader: Story = {
  render: (args) => (
    <Card {...args} media={<SampleImage />} footer={<FooterButtons />} />
  ),
}
```

**Vertical No Footer**

```tsx
export const VerticalNoFooter: Story = {
  render: (args) => (
    <Card
      {...args}
      media={<SampleImage />}
      headerTitle="Card Header"
      headerActions={<CogButton />}
    />
  ),
}
```

**Vertical Media Only**

```tsx
export const VerticalMediaOnly: Story = {
  render: (args) => <Card {...args} media={<SampleImage />} />,
}
```

**Vertical Square Ratio**

```tsx
export const VerticalSquareRatio: Story = {
  render: (args) => (
    <Card
      {...args}
      contentRatio="1:1"
      media={<SampleImage ratio="1:1" />}
      headerTitle="Card Header"
      headerActions={<CogButton />}
      footer={<FooterButtons />}
    />
  ),
}
```

**Vertical Over Header**

```tsx
export const VerticalOverHeader: Story = {
  render: (args) => (
    <Card
      {...args}
      overHeader
      media={<SampleImage />}
      headerActions={<CogButton />}
      footer={<FooterButtons />}
    />
  ),
}
```

**Vertical Over Header Square**

```tsx
export const VerticalOverHeaderSquare: Story = {
  render: (args) => (
    <Card
      {...args}
      overHeader
      contentRatio="1:1"
      media={<SampleImage ratio="1:1" />}
      headerActions={<CogButton />}
      footer={<FooterBadge />}
    />
  ),
}
```

**Small Vertical**

```tsx
export const SmallVertical: Story = {
  render: (args) => (
    <Card
      {...args}
      size="small"
      media={<SampleImage />}
      headerTitle="Card Header"
      headerActions={<CogButton />}
      footer={<FooterButtons />}
    />
  ),
}
```

**Small Vertical Over Header**

```tsx
export const SmallVerticalOverHeader: Story = {
  render: (args) => (
    <Card
      {...args}
      size="small"
      overHeader
      media={<SampleImage />}
      headerActions={<CogButton />}
      footer={<FooterButtons />}
    />
  ),
}
```

**Horizontal With Icon**

```tsx
export const HorizontalWithIcon: Story = {
  render: (args) => (
    <Card
      {...args}
      orientation="horizontal"
      media={<SampleIcon />}
      footer={<FooterButtons />}
    />
  ),
}
```

**Horizontal No Footer**

```tsx
export const HorizontalNoFooter: Story = {
  render: (args) => (
    <Card {...args} orientation="horizontal" media={<SampleIcon />} />
  ),
}
```

**Not Clickable**

```tsx
export const NotClickable: Story = {
  render: (args) => (
    <Card
      {...args}
      clickable={false}
      media={<SampleImage />}
      headerTitle="Card Header"
      headerActions={<CogButton />}
      footer={<FooterButtons />}
    />
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <section>
        <p style={{ fontSize: 12, color: '#8b8595', marginBottom: 12 }}>
          Vertical · Normal · overHeader=false
        </p>
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <Card
            media={<SampleImage />}
            headerTitle="Com Header"
            headerActions={<CogButton />}
            title="Card Title"
            subtitle="Subtítulo do card"
            footer={<FooterButtons />}
          />
          <Card
  // … +123 linhas — ver o arquivo da story
```

### Collapse

Visual: `organisms/Collapse.html` · stories: `Collapse.stories.tsx` (13)

```tsx
import { Collapse, Badge, ButtonSoft } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  size: 'normal',
  outline: true,
  background: false,
  title: 'Lorem Ipsum',
  subtitle: 'Subtitle',
}
```

**Default**

```tsx
export const Default: Story = {
  render: (args) => (
    <Collapse {...args} icon={<BoxIcon size={20} />} defaultOpen={false}>
      <SampleContent />
    </Collapse>
  ),
}
```

**Default Open**

```tsx
export const DefaultOpen: Story = {
  render: (args) => (
    <Collapse {...args} icon={<BoxIcon size={20} />} defaultOpen>
      <SampleContent />
    </Collapse>
  ),
}
```

**Small**

```tsx
export const Small: Story = {
  render: (args) => (
    <Collapse
      {...args}
      size="small"
      icon={<BoxIcon size={12} />}
      rightInfo={<Badge color="confirmation">Badge</Badge>}
    >
      <SampleContent />
    </Collapse>
  ),
}
```

**Normal**

```tsx
export const Normal: Story = {
  render: (args) => (
    <Collapse
      {...args}
      size="normal"
      icon={<BoxIcon size={16} />}
      rightInfo={<Badge color="success">Ativo</Badge>}
    >
      <SampleContent />
    </Collapse>
  ),
}
```

**Big**

```tsx
export const Big: Story = {
  render: (args) => (
    <Collapse
      {...args}
      size="big"
      icon={<BoxIcon size={22} />}
      rightInfo={
        <ButtonSoft variant="outline" size="sm">
          Ver mais
        </ButtonSoft>
      }
    >
      <SampleContent />
    </Collapse>
  ),
}
```

**Bigger**

```tsx
export const Bigger: Story = {
  render: (args) => (
    <Collapse
      {...args}
      size="bigger"
      icon={<BoxIcon size={28} />}
      rightInfo={
        <ButtonSoft variant="outline" size="md">
          Ver mais
        </ButtonSoft>
      }
    >
      <SampleContent />
    </Collapse>
  ),
}
```

**No Outline**

```tsx
export const NoOutline: Story = {
  render: (args) => (
    <Collapse {...args} outline={false} icon={<BoxIcon size={16} />}>
      <SampleContent />
    </Collapse>
  ),
}
```

**With Background**

```tsx
export const WithBackground: Story = {
  render: (args) => (
    <Collapse {...args} background icon={<BoxIcon size={16} />}>
      <SampleContent />
    </Collapse>
  ),
}
```

**No Outline With Background**

```tsx
export const NoOutlineWithBackground: Story = {
  render: (args) => (
    <Collapse {...args} outline={false} background icon={<BoxIcon size={16} />}>
      <SampleContent />
    </Collapse>
  ),
}
```

**No Icon**

```tsx
export const NoIcon: Story = {
  render: (args) => (
    <Collapse {...args}>
      <SampleContent />
    </Collapse>
  ),
}
```

**No Subtitle**

```tsx
export const NoSubtitle: Story = {
  render: (args) => (
    <Collapse {...args} subtitle={undefined} icon={<BoxIcon size={16} />}>
      <SampleContent />
    </Collapse>
  ),
}
```

**Controlled Example**

```tsx
export const ControlledExample: Story = {
  render: () => (
    <Controlled>
      {(open, setOpen) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <ButtonSoft
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
            >
              Abrir
            </ButtonSoft>
            <ButtonSoft
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Fechar
            </ButtonSoft>
          </div>
          <Collapse
            open={open}
            onOpenChange={setOpen}
  // … +11 linhas — ver o arquivo da story
```

**All Sizes**

```tsx
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['small', 'normal', 'big', 'bigger'] as const).map((size) => (
        <Collapse
          key={size}
          size={size}
          title="Lorem Ipsum"
          subtitle="Subtitle"
          icon={
            <BoxIcon
              size={
                size === 'small'
                  ? 12
                  : size === 'normal'
                    ? 16
                    : size === 'big'
                      ? 22
                      : 28
              }
            />
          }
          rightInfo={<Badge color="confirmation">{size}</Badge>}
          defaultOpen={size === 'big'}
  // … +7 linhas — ver o arquivo da story
```

### DeepSelector

Visual: `organisms/DeepSelector.html` · stories: `DeepSelector.stories.tsx` (8)

```tsx
import {
  DeepSelector,
  type DeepSelectorBreadcrumb,
  type DeepSelectorItem,
  type DeepSelectorSection,
  type LucideIcon,
} from '@ploomescrm/ui';
```

**Playground (navegação completa)**

```tsx
export const Default: Story = {
  name: 'Playground (navegação completa)',
  render: () => <PlaygroundDemo />,
}
```

**Com botão de ação**

```tsx
export const WithActionButton: Story = {
  name: 'Com botão de ação',
  render: () => <PlaygroundDemo actionButton />,
}
```

**Loading**

```tsx
export const Loading: Story = {
  render: () => (
    <DeepSelector
      isLoading
      sections={[]}
      breadcrumbs={[{ id: 'root', label: 'Organização' }]}
      searchInput={{ value: '', placeholder: 'Busque por nome' }}
      onClose={() => {}}
      onSelectItem={() => {}}
    />
  ),
}
```

**Lista vazia**

```tsx
export const Empty: Story = {
  name: 'Lista vazia',
  render: () => (
    <DeepSelector
      sections={[]}
      breadcrumbs={[
        { id: 'root', label: 'Organização' },
        { id: 'financeiro', label: 'Financeiro' },
      ]}
      emptyText="Nenhuma equipe neste setor"
      searchInput={{ value: '', placeholder: 'Busque por nome' }}
      onClose={() => {}}
      onSelectItem={() => {}}
    />
  ),
}
```

**Com itens desabilitados**

```tsx
export const WithDisabledItems: Story = {
  name: 'Com itens desabilitados',
  render: () => (
    <DeepSelector
      sections={[
        {
          title: 'Setores',
          items: [
            { id: 1, label: 'Comercial', icon: Building2, hasChildren: true },
            {
              id: 2,
              label: 'Marketing (sem permissão)',
              icon: Building2,
              disabled: true,
            },
            {
              id: 3,
              label: 'Tecnologia (sem permissão)',
              icon: Building2,
              disabled: true,
              hasChildren: true,
            },
            { id: 4, label: 'Financeiro', icon: Building2 },
          ],
  // … +10 linhas — ver o arquivo da story
```

**Rolagem infinita**

```tsx
export const InfiniteScroll: Story = {
  name: 'Rolagem infinita',
  render: () => <InfiniteScrollDemo />,
}
```

**Múltiplas seções**

```tsx
export const MultipleSections: Story = {
  name: 'Múltiplas seções',
  render: () => (
    <DeepSelector
      sections={[
        {
          sectionId: 'recentes',
          title: 'Recentes',
          items: pessoas('Ana Souza', 'Rafael Torres').map(toItem),
        },
        {
          sectionId: 'setores',
          title: 'Setores',
          items: ORGANOGRAMA.map(toItem),
        },
      ]}
      breadcrumbs={[{ id: 'root', label: 'Organização' }]}
      searchInput={{ value: '', placeholder: 'Busque por nome' }}
      onClose={() => {}}
      onSelectItem={() => {}}
      onSelectNestedItem={() => {}}
    />
  ),
}
```

**Largura expandida**

```tsx
export const ExpandWidth: Story = {
  name: 'Largura expandida',
  render: () => (
    <div className="w-full max-w-[600px]">
      <DeepSelector
        expandWidth
        sections={[{ title: 'Setores', items: ORGANOGRAMA.map(toItem) }]}
        breadcrumbs={[{ id: 'root', label: 'Organização' }]}
        searchInput={{ value: '', placeholder: 'Busque por nome' }}
        onClose={() => {}}
        onSelectItem={() => {}}
        onSelectNestedItem={() => {}}
      />
    </div>
  ),
}
```

### EmptyLabel

Visual: `organisms/EmptyLabel.html` · stories: `EmptyLabel.stories.tsx` (8)

```tsx
import { EmptyLabel, ButtonSoft, Icon } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  showIcon: true,
  title: 'Não há dados para exibir',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius odio ex, sed euismod justo mattis in.',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**With Action**

```tsx
export const WithAction: Story = {
  render: (args) => <EmptyLabel {...args} action={<AddButton />} />,
}
```

**No Icon**

```tsx
export const NoIcon: Story = {
  render: (args) => (
    <EmptyLabel {...args} showIcon={false} action={<AddButton />} />
  ),
}
```

**No Content**

```tsx
export const NoContent: Story = {
  render: (args) => (
    <EmptyLabel {...args} content={undefined} action={<AddButton />} />
  ),
}
```

**No Action**

```tsx
export const NoAction: Story = {
  render: (args) => <EmptyLabel {...args} />,
}
```

**Custom Icon**

```tsx
export const CustomIcon: Story = {
  render: (args) => (
    <EmptyLabel
      {...args}
      icon={<SearchIcon />}
      title="Nenhum resultado encontrado"
      content="Tente ajustar os filtros ou buscar por outro termo."
      action={<ImportButton />}
    />
  ),
}
```

**Custom Icon File**

```tsx
export const CustomIconFile: Story = {
  render: (args) => (
    <EmptyLabel
      {...args}
      icon={<FileIcon />}
      title="Nenhum arquivo encontrado"
      content="Faça upload de um arquivo para começar."
      action={<ImportButton />}
    />
  ),
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 40,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        padding: 40,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: '#8b8595', marginBottom: 4 }}>
          icon + content + action
        </p>
        <EmptyLabel
          title="Não há dados para exibir"
  // … +62 linhas — ver o arquivo da story
```

### FieldSelector

Visual: `organisms/FieldSelector.html` · stories: `FieldSelector.stories.tsx` (7)

```tsx
import { FieldSelector, type FieldSelectorItem } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  title: 'Lorem Ipsum',
  showSearch: true,
  searchPlaceholder: 'Busque um campo',
}
```

**Default**

```tsx
export const Default: Story = {
  render: (args) => (
    <FieldSelector
      {...args}
      items={SAMPLE_ITEMS}
      onAddNew={() => alert('Adicionar campo')}
    />
  ),
}
```

**With Action Items**

```tsx
export const WithActionItems: Story = {
  render: (args) => (
    <FieldSelector
      {...args}
      items={ITEMS_WITH_ACTION}
      onAddNew={() => alert('Adicionar campo')}
    />
  ),
}
```

**No Search**

```tsx
export const NoSearch: Story = {
  render: (args) => (
    <FieldSelector {...args} showSearch={false} items={SAMPLE_ITEMS} />
  ),
}
```

**No Add Button**

```tsx
export const NoAddButton: Story = {
  render: (args) => <FieldSelector {...args} items={SAMPLE_ITEMS} />,
}
```

**Empty List**

```tsx
export const EmptyList: Story = {
  render: (args) => (
    <FieldSelector
      {...args}
      items={[]}
      onAddNew={() => alert('Adicionar campo')}
    />
  ),
}
```

**With Client Filter**

```tsx
export const WithClientFilter: Story = {
  render: (args) => <ClientFilterDemo {...args} />,
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
}
```

### FilterGroup

Visual: `organisms/FilterGroup.html` · stories: `FilterGroup.stories.tsx` (7)

```tsx
import {
  FilterGroup,
  FilterGroupSelect,
  FilterGroupDateField,
  FilterGroupDateRange,
  type FilterGroupSession,
} from '@ploomescrm/ui';
```

**Empty (no field selected)**

```tsx
export const EmptyRow: Story = {
  name: 'Empty (no field selected)',
  render: () => (
    <div className="w-full max-w-[600px]">
      <FilterGroup
        sessions={[
          {
            rows: [{ fieldSelector: <FieldTrigger /> }],
          },
        ]}
      />
    </div>
  ),
}
```

**Single session (filled)**

```tsx
export const SingleSession: Story = {
  name: 'Single session (filled)',
  render: () => (
    <div className="w-full max-w-[700px]">
      <FilterGroup
        sessions={[
          {
            rows: [
              {
                fieldSelector: <FieldTrigger value="Nome" />,
                conditionSelector: <ConditionTrigger value="Igual a" />,
                valueInput: <TextValueInput />,
                onRemove: () => {},
              },
              {
                fieldSelector: <FieldTrigger value="Cargo" />,
                conditionSelector: <ConditionTrigger value="Contém" />,
                valueInput: <TextValueInput />,
                onRemove: () => {},
              },
            ],
            onAddRow: () => {},
            onRemoveSession: () => {},
          },
  // … +5 linhas — ver o arquivo da story
```

**Row with date range**

```tsx
export const WithDateRange: Story = {
  name: 'Row with date range',
  render: () => (
    <div className="w-full max-w-[700px]">
      <FilterGroup
        sessions={[
          {
            rows: [
              {
                fieldSelector: <FieldTrigger value="Data de criação" />,
                conditionSelector: <ConditionTrigger value="Intervalo" />,
                valueInput: (
                  <FilterGroupDateRange
                    fromInput={<FilterGroupDateField />}
                    toInput={<FilterGroupDateField />}
                  />
                ),
                onRemove: () => {},
              },
            ],
            onAddRow: () => {},
          },
        ]}
      />
  // … +3 linhas — ver o arquivo da story
```

**Multiple sessions (OR mode)**

```tsx
export const MultipleSessionsOR: Story = {
  name: 'Multiple sessions (OR mode)',
  render: () => (
    <div className="w-full max-w-[700px]">
      <FilterGroup
        sessions={[
          {
            rows: [
              {
                fieldSelector: <FieldTrigger value="Nome" />,
                conditionSelector: <ConditionTrigger value="Igual a" />,
                valueInput: <TextValueInput />,
                onRemove: () => {},
              },
            ],
            onAddRow: () => {},
            onRemoveSession: () => {},
          },
          {
            rows: [
              {
                fieldSelector: <FieldTrigger value="Cargo" />,
                conditionSelector: <ConditionTrigger value="Contém" />,
                valueInput: <TextValueInput />,
  // … +12 linhas — ver o arquivo da story
```

**With alert message**

```tsx
export const WithAlert: Story = {
  name: 'With alert message',
  render: () => (
    <div className="w-full max-w-[700px]">
      <FilterGroup
        alert={'diminua a quantidade de condições "E"'}
        sessions={[
          {
            rows: [
              {
                fieldSelector: <FieldTrigger value="Nome" />,
                conditionSelector: <ConditionTrigger value="Igual a" />,
                valueInput: <TextValueInput />,
                onRemove: () => {},
              },
            ],
            onAddRow: () => {},
          },
        ]}
      />
    </div>
  ),
}
```

**Interactive**

```tsx
export const Interactive: Story = {
  render: () => <InteractiveDemo />,
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 48, padding: 40 }}
    >
      <div>
        <p style={{ fontSize: 12, color: '#8b8595', marginBottom: 12 }}>
          filled=False (campo não selecionado)
        </p>
        <div className="w-full max-w-[700px]">
          <FilterGroup
            sessions={[{ rows: [{ fieldSelector: <FieldTrigger /> }] }]}
          />
        </div>
      </div>

      <div>
        <p style={{ fontSize: 12, color: '#8b8595', marginBottom: 12 }}>
          filled=True, or=False (sessão única)
        </p>
        <div className="w-full max-w-[700px]">
          <FilterGroup
            sessions={[
              {
  // … +96 linhas — ver o arquivo da story
```

### GridView

Visual: `organisms/GridView.html` · stories: `GridView.stories.tsx` (5)

```tsx
import { GridView, GridViewChildren } from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-level_1 p-[20px]">
      <GridView columns={12} rowHeight={30}>
        <GridViewChildren i="vendas" x={0} y={0} w={4} h={5} minW={2} minH={3}>
          <DemoCard title="Vendas do mês" />
        </GridViewChildren>
        <GridViewChildren i="funil" x={4} y={0} w={4} h={5} minW={2} minH={3}>
          <DemoCard title="Funil" />
        </GridViewChildren>
        <GridViewChildren
          i="atividades"
          x={8}
          y={0}
          w={4}
          h={5}
          minW={2}
          minH={3}
        >
          <DemoCard title="Atividades" />
        </GridViewChildren>
        <GridViewChildren i="receita" x={0} y={5} w={8} h={6} minW={3} minH={4}>
          <DemoCard title="Receita por período" />
        </GridViewChildren>
  // … +7 linhas — ver o arquivo da story
```

**Read only (no drag/resize)**

```tsx
export const ReadOnly: Story = {
  name: 'Read only (no drag/resize)',
  render: () => (
    <div className="min-h-screen bg-neutral-level_1 p-[20px]">
      <GridView
        columns={12}
        rowHeight={30}
        isDraggable={false}
        isResizable={false}
      >
        <GridViewChildren i="a" x={0} y={0} w={6} h={5}>
          <DemoCard title="Somente leitura">
            Drag e resize desabilitados
          </DemoCard>
        </GridViewChildren>
        <GridViewChildren i="b" x={6} y={0} w={6} h={5}>
          <DemoCard title="Somente leitura">
            Drag e resize desabilitados
          </DemoCard>
        </GridViewChildren>
      </GridView>
    </div>
  ),
}
```

**Per-breakpoint columns**

```tsx
export const PerBreakpointColumns: Story = {
  name: 'Per-breakpoint columns',
  render: () => (
    <div className="min-h-screen bg-neutral-level_1 p-[20px]">
      <p className="mb-[10px] text-sm text-font-level_1">
        Redimensione o canvas: lg=12, md=8, sm=4, xs=2, xxs=1 colunas
      </p>
      <GridView
        columns={{ lg: 12, md: 8, sm: 4, xs: 2, xxs: 1 }}
        rowHeight={30}
      >
        {['a', 'b', 'c', 'd'].map((id, index) => (
          <GridViewChildren
            key={id}
            i={id}
            x={(index % 4) * 3}
            y={0}
            w={3}
            h={4}
          >
            <DemoCard title={`Card ${id.toUpperCase()}`} />
          </GridViewChildren>
        ))}
      </GridView>
  // … +3 linhas — ver o arquivo da story
```

**With drag/resize callbacks**

```tsx
export const WithCallbacks: Story = {
  name: 'With drag/resize callbacks',
  render: () => <CallbacksDemo />,
}
```

**Fixed width (1000px)**

```tsx
export const FixedWidth: Story = {
  name: 'Fixed width (1000px)',
  render: () => (
    <div className="min-h-screen bg-neutral-level_1 p-[20px]">
      <GridView
        width={1000}
        columns={10}
        rowHeight={30}
        className="mx-auto w-[1000px]"
      >
        <GridViewChildren i="a" x={0} y={0} w={5} h={5}>
          <DemoCard title="Largura fixa" />
        </GridViewChildren>
        <GridViewChildren i="b" x={5} y={0} w={5} h={5}>
          <DemoCard title="Sem WidthProvider" />
        </GridViewChildren>
      </GridView>
    </div>
  ),
}
```

### HorizontalMenu

Visual: `organisms/HorizontalMenu.html` · stories: `HorizontalMenu.stories.tsx` (7)

```tsx
import { HorizontalMenu, type HorizontalMenuActionItem } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  searchPlaceholder: 'Busque em qualquer lugar',
}
```

**Default**

```tsx
export const Default: Story = {
  render: (args) => (
    <HorizontalMenu
      {...args}
      onAdd={() => {}}
      actions={DEFAULT_ACTIONS}
      user={SAMPLE_USER}
      onUserClick={() => {}}
    />
  ),
}
```

**With avatar image**

```tsx
export const WithAvatar: Story = {
  name: 'With avatar image',
  render: (args) => (
    <HorizontalMenu
      {...args}
      onAdd={() => {}}
      actions={DEFAULT_ACTIONS}
      user={{
        name: 'Helena Santos',
        avatar: 'https://i.pravatar.cc/40?img=47',
      }}
      onUserClick={() => {}}
    />
  ),
}
```

**Without add button**

```tsx
export const NoAddButton: Story = {
  name: 'Without add button',
  render: (args) => (
    <HorizontalMenu
      {...args}
      actions={DEFAULT_ACTIONS}
      user={SAMPLE_USER}
      onUserClick={() => {}}
    />
  ),
}
```

**Without user profile**

```tsx
export const NoUser: Story = {
  name: 'Without user profile',
  render: (args) => (
    <HorizontalMenu {...args} onAdd={() => {}} actions={DEFAULT_ACTIONS} />
  ),
}
```

**Controlled Search**

```tsx
export const ControlledSearch: Story = {
  render: (args) => <ControlledSearchDemo {...args} />,
}
```

**Minimal (search only)**

```tsx
export const Minimal: Story = {
  name: 'Minimal (search only)',
  render: (args) => <HorizontalMenu {...args} actions={[]} />,
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-[1px] bg-neutral-level_2">
      <div className="flex flex-col gap-2 bg-background p-4">
        <p className="text-xs text-font-level_2">
          Figma variant (com +, busca, ações e perfil)
        </p>
        <HorizontalMenu
          onAdd={() => {}}
          actions={DEFAULT_ACTIONS}
          user={SAMPLE_USER}
          onUserClick={() => {}}
        />
      </div>

      <div className="flex flex-col gap-2 bg-background p-4">
        <p className="text-xs text-font-level_2">Com avatar de imagem</p>
        <HorizontalMenu
          onAdd={() => {}}
          actions={DEFAULT_ACTIONS}
          user={{
            name: 'Helena Santos',
            avatar: 'https://i.pravatar.cc/40?img=47',
          }}
  // … +20 linhas — ver o arquivo da story
```

### HorizontalTabs

Visual: `organisms/HorizontalTabs.html` · stories: `HorizontalTabs.stories.tsx` (7)

```tsx
import { HorizontalTabs, type HorizontalTabItem } from '@ploomescrm/ui';
```

**Figma variant (only label)**

```tsx
export const Default: Story = {
  name: 'Figma variant (only label)',
  render: () => <HorizontalTabs items={SIMPLE_TABS} defaultActiveId="geral" />,
}
```

**With icons and counters**

```tsx
export const WithIconsAndCounters: Story = {
  name: 'With icons and counters',
  render: () => <HorizontalTabs items={ICON_TABS} defaultActiveId="geral" />,
}
```

**Real labels (mixed)**

```tsx
export const RealLabels: Story = {
  name: 'Real labels (mixed)',
  render: () => <HorizontalTabs items={NAMED_TABS} defaultActiveId="resumo" />,
}
```

**No initial selection**

```tsx
export const NoDefaultActive: Story = {
  name: 'No initial selection',
  render: () => <HorizontalTabs items={NAMED_TABS} />,
}
```

**With Disabled**

```tsx
export const WithDisabled: Story = {
  render: () => (
    <HorizontalTabs
      items={[
        { id: 'a', label: 'Ativo', icon: <CardIcon /> },
        { id: 'b', label: 'Desativado', icon: <ListIcon />, disabled: true },
        { id: 'c', label: 'Com badge', count: 5 },
        { id: 'd', label: 'Outro' },
      ]}
      defaultActiveId="a"
    />
  ),
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-xs text-font-level_2">
          Figma — só label (sem ícone, sem contador)
        </p>
        <HorizontalTabs items={SIMPLE_TABS} defaultActiveId="geral" />
      </div>

      <div>
        <p className="mb-2 text-xs text-font-level_2">
          Auxiliares — ícone + contador (badge ativo = brand, inativo = muted)
        </p>
        <HorizontalTabs items={ICON_TABS} defaultActiveId="geral" />
      </div>

      <div>
        <p className="mb-2 text-xs text-font-level_2">
          Labels reais + mix de ícone/contador
        </p>
        <HorizontalTabs items={NAMED_TABS} defaultActiveId="atividades" />
      </div>
    </div>
  // … +2 linhas — ver o arquivo da story
```

### ImageGallery

Visual: `organisms/ImageGallery.html` · stories: `ImageGallery.stories.tsx` (7)

```tsx
import {
  ImageGallery,
  GalleryImage,
  type GalleryImageItem,
} from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  sortLabel: 'Mais recentes',
  searchPlaceholder: 'Buscar pelo nome',
}
```

**Default**

```tsx
export const Default: Story = {
  render: (args) => (
    <div className="h-[430px] w-full overflow-hidden rounded-[5px] border border-neutral-level_2">
      <ImageGallery
        {...args}
        items={SAMPLE_ITEMS}
        onAddImage={() => {}}
        onSortClick={() => {}}
      />
    </div>
  ),
}
```

**Empty**

```tsx
export const Empty: Story = {
  render: (args) => (
    <div className="h-[300px] w-full overflow-hidden rounded-[5px] border border-neutral-level_2">
      <ImageGallery {...args} items={[]} onAddImage={() => {}} />
    </div>
  ),
}
```

**Without add button**

```tsx
export const NoAddButton: Story = {
  name: 'Without add button',
  render: (args) => (
    <div className="h-[430px] w-full overflow-hidden rounded-[5px] border border-neutral-level_2">
      <ImageGallery {...args} items={SAMPLE_ITEMS} />
    </div>
  ),
}
```

**Controlled Search**

```tsx
export const ControlledSearch: Story = {
  render: (args) => <ControlledSearchDemo {...args} />,
}
```

**GalleryImage — single card**

```tsx
export const GalleryImageCard: Story = {
  name: 'GalleryImage — single card',
  render: () => (
    <div className="flex flex-wrap gap-[20px]">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-font-level_2">Default</p>
        <GalleryImage
          src="https://picsum.photos/seed/42/400/400"
          name="Reason transvaluation will endless"
          extension=".jpg"
          onDelete={() => {}}
          onClick={() => {}}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-font-level_2">Nome curto</p>
        <GalleryImage
          src="https://picsum.photos/seed/43/400/400"
          name="Reason"
          extension=".jpg"
          onDelete={() => {}}
          onClick={() => {}}
        />
      </div>
  // … +12 linhas — ver o arquivo da story
```

**Inside modal (HeaderModal layout)**

```tsx
export const InsideModal: Story = {
  name: 'Inside modal (HeaderModal layout)',
  render: (args) => (
    <div className="flex h-[540px] w-full items-center justify-center bg-[rgba(76,85,102,0.8)] p-[30px]">
      <div className="flex max-w-[1030px] flex-1 flex-col overflow-hidden rounded-[5px] bg-background shadow-[0px_24px_38px_0px_rgba(0,0,0,0.14),0px_9px_46px_0px_rgba(0,0,0,0.12),0px_11px_15px_0px_rgba(0,0,0,0.20)]">
        <div className="flex h-[50px] shrink-0 items-center border-b border-neutral-level_2 px-[15px]">
          <span className="min-w-0 flex-1 text-base font-semibold text-font-level_1">
            Lorem Ipsum
          </span>
          <button
            type="button"
            aria-label="Fechar"
            className="flex size-[35px] shrink-0 items-center justify-center rounded-[5px] border border-neutral-level_2 bg-background text-font transition-colors hover:bg-neutral-level_1"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
  // … +15 linhas — ver o arquivo da story
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
}
```

### InfiniteScroll

Visual: `organisms/InfiniteScroll.html` · stories: `InfiniteScroll.stories.tsx` (5)

```tsx
import { InfiniteScroll } from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: () => <InfiniteScrollDemo />,
}
```

**Focus on loader**

```tsx
export const FocusOnShowLoader: Story = {
  name: 'Focus on loader',
  render: () => <InfiniteScrollDemo focusOnShowLoader />,
}
```

**Error while loading**

```tsx
export const WithError: Story = {
  name: 'Error while loading',
  render: () => <InfiniteScrollDemo totalPages={10} failOnPage={2} />,
}
```

**End of list**

```tsx
export const EndReached: Story = {
  name: 'End of list',
  render: () => <InfiniteScrollDemo totalPages={1} />,
}
```

**Custom loader and end message**

```tsx
export const CustomContents: Story = {
  name: 'Custom loader and end message',
  render: () => <CustomContentDemo />,
}
```

### Loader

Visual: `organisms/Loader.html` · stories: `Loader.stories.tsx` (5)

```tsx
import { Loader } from '@ploomescrm/ui';

// props padrão de todas as stories (meta.args)
args: {
  title: 'Descrição do carregamento',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius odio ex, sed euismod justo mattis in.',
}
```

**Default**

```tsx
export const Default: Story = {}
```

**Title Only**

```tsx
export const TitleOnly: Story = {
  args: { description: undefined },
}
```

**Custom Title**

```tsx
export const CustomTitle: Story = {
  args: {
    title: 'Carregando dados…',
    description: 'Por favor, aguarde enquanto buscamos as informações.',
  },
}
```

**Short Message**

```tsx
export const ShortMessage: Story = {
  args: {
    title: 'Aguarde',
    description: undefined,
  },
}
```

**All Variants**

```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-[60px] p-[40px]">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-font-level_2">Com descrição (Figma)</p>
        <Loader
          title="Descrição do carregamento"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius odio ex, sed euismod justo mattis in."
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-font-level_2">Sem descrição</p>
        <Loader title="Carregando…" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-font-level_2">Título personalizado</p>
        <Loader
          title="Salvando alterações"
          description="Suas mudanças estão sendo salvas. Isso pode levar alguns instantes."
        />
      </div>
    </div>
  ),
}
```

### ModalCenter

Visual: `organisms/ModalCenter.html` · stories: `ModalCenter.stories.tsx` (7)

```tsx
import { ModalCenter } from '@ploomescrm/ui';
```

**Default** · _inclui captura do estado aberto no HTML_

```tsx
export const Default: Story = {
  render: () => (
    <ModalCenterDemo title="Lorem Ipsum" actionLabel="Lorem Ipsum">
      <PlaceholderContent />
    </ModalCenterDemo>
  ),
}
```

**With Secondary Button** · _inclui captura do estado aberto no HTML_

```tsx
export const WithSecondaryButton: Story = {
  render: () => (
    <ModalCenterDemo
      title="Confirmar ação"
      secondaryLabel="Cancelar"
      actionLabel="Confirmar"
      actionColor="confirmation"
    >
      <PlaceholderContent />
    </ModalCenterDemo>
  ),
}
```

**Without footer** · _inclui captura do estado aberto no HTML_

```tsx
export const NoFooter: Story = {
  name: 'Without footer',
  render: () => (
    <ModalCenterDemo title="Visualização">
      <PlaceholderContent height={400} />
    </ModalCenterDemo>
  ),
}
```

**Footer with text** · _inclui captura do estado aberto no HTML_

```tsx
export const WithFooterText: Story = {
  name: 'Footer with text',
  render: () => (
    <ModalCenterDemo
      title="Informações"
      footerText="Última atualização: hoje"
      actionLabel="Salvar"
    >
      <PlaceholderContent />
    </ModalCenterDemo>
  ),
}
```

**Brand color action** · _inclui captura do estado aberto no HTML_

```tsx
export const BrandAction: Story = {
  name: 'Brand color action',
  render: () => (
    <ModalCenterDemo
      title="Novo registro"
      secondaryLabel="Cancelar"
      actionLabel="Criar"
      actionColor="brand"
      triggerClassName="rounded-[5px] bg-brand px-[15px] py-[8px] text-sm font-semibold text-white"
    >
      <PlaceholderContent />
    </ModalCenterDemo>
  ),
}
```

**Scrollable content** · _inclui captura do estado aberto no HTML_

```tsx
export const ScrollableContent: Story = {
  name: 'Scrollable content',
  render: () => (
    <ModalCenterDemo title="Conteúdo longo" actionLabel="Fechar" maxWidth={800}>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="rounded-[5px] border border-neutral-level_2 p-[15px] text-sm text-font"
          >
            <p className="font-semibold">Seção {i + 1}</p>
            <p className="mt-1 text-font-level_1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius
              odio ex, sed euismod justo mattis in.
            </p>
          </div>
        ))}
      </div>
    </ModalCenterDemo>
  ),
}
```

**With Breadcrumbs** · _inclui captura do estado aberto no HTML_

```tsx
export const WithBreadcrumbs: Story = {
  render: () => (
    <ModalCenterDemo
      headerLeft="breadcrumbs"
      breadcrumbItems={[
        { label: 'Início' },
        { label: 'Clientes' },
        { label: 'Detalhe' },
      ]}
      actionLabel="Salvar"
    >
      <PlaceholderContent />
    </ModalCenterDemo>
  ),
}
```

### ModalFloating

Visual: `organisms/ModalFloating.html` · stories: `ModalFloating.stories.tsx` (8)

```tsx
import { ModalFloating } from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: () => (
    <ModalFloating
      title="Lorem Ipsum"
      onClose={() => {}}
      actionLabel="Lorem Ipsum"
      onActionClick={() => {}}
      width={350}
      height={350}
    >
      <PlaceholderContent />
    </ModalFloating>
  ),
}
```

**With Secondary Button**

```tsx
export const WithSecondaryButton: Story = {
  render: () => (
    <ModalFloating
      title="Confirmar ação"
      onClose={() => {}}
      secondaryLabel="Cancelar"
      onSecondaryClick={() => {}}
      actionLabel="Confirmar"
      actionColor="confirmation"
      onActionClick={() => {}}
      width={350}
      height={350}
    >
      <PlaceholderContent />
    </ModalFloating>
  ),
}
```

**Without footer**

```tsx
export const NoFooter: Story = {
  name: 'Without footer',
  render: () => (
    <ModalFloating
      title="Visualização"
      onClose={() => {}}
      width={350}
      height={350}
    >
      <PlaceholderContent height={250} />
    </ModalFloating>
  ),
}
```

**Footer with text**

```tsx
export const WithFooterText: Story = {
  name: 'Footer with text',
  render: () => (
    <ModalFloating
      title="Informações"
      onClose={() => {}}
      footerText="Última atualização: hoje"
      actionLabel="Salvar"
      onActionClick={() => {}}
      width={350}
      height={350}
    >
      <PlaceholderContent />
    </ModalFloating>
  ),
}
```

**Brand color action**

```tsx
export const BrandAction: Story = {
  name: 'Brand color action',
  render: () => (
    <ModalFloating
      title="Novo registro"
      onClose={() => {}}
      secondaryLabel="Cancelar"
      onSecondaryClick={() => {}}
      actionLabel="Criar"
      actionColor="brand"
      onActionClick={() => {}}
      width={350}
      height={350}
    >
      <PlaceholderContent />
    </ModalFloating>
  ),
}
```

**Wide panel (600px)**

```tsx
export const WidePanel: Story = {
  name: 'Wide panel (600px)',
  render: () => (
    <ModalFloating
      title="Painel largo"
      onClose={() => {}}
      actionLabel="Salvar"
      onActionClick={() => {}}
      width={600}
    >
      <PlaceholderContent height={300} />
    </ModalFloating>
  ),
}
```

**With Breadcrumbs**

```tsx
export const WithBreadcrumbs: Story = {
  render: () => (
    <ModalFloating
      headerLeft="breadcrumbs"
      breadcrumbItems={[
        { label: 'Início' },
        { label: 'Clientes' },
        { label: 'Detalhe' },
      ]}
      onClose={() => {}}
      actionLabel="Salvar"
      onActionClick={() => {}}
      width={400}
      height={350}
    >
      <PlaceholderContent />
    </ModalFloating>
  ),
}
```

**All variants**

```tsx
export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-wrap items-start gap-[40px] p-[40px]">
      <div className="flex flex-col gap-1">
        <p className="text-xs text-font-level_2">Com footer (Figma)</p>
        <ModalFloating
          title="Lorem Ipsum"
          onClose={() => {}}
          actionLabel="Lorem Ipsum"
          onActionClick={() => {}}
          width={350}
          height={350}
        >
          <PlaceholderContent />
        </ModalFloating>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs text-font-level_2">Sem footer</p>
        <ModalFloating
          title="Visualização"
          onClose={() => {}}
          width={350}
          height={350}
  // … +23 linhas — ver o arquivo da story
```

### ModalSide

Visual: `organisms/ModalSide.html` · stories: `ModalSide.stories.tsx` (11)

```tsx
import { ModalSide } from '@ploomescrm/ui';
```

**Default** · _inclui captura do estado aberto no HTML_

```tsx
export const Default: Story = {
  render: () => (
    <ModalSideDemo title="Lorem Ipsum" actionLabel="Lorem Ipsum">
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**Orientation — right** · _inclui captura do estado aberto no HTML_

```tsx
export const RightOrientation: Story = {
  name: 'Orientation — right',
  render: () => (
    <ModalSideDemo
      orientation="right"
      title="Lorem Ipsum"
      actionLabel="Lorem Ipsum"
      triggerLabel="Abrir (direita)"
    >
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**Width — normal (600px)** · _inclui captura do estado aberto no HTML_

```tsx
export const WidthNormal: Story = {
  name: 'Width — normal (600px)',
  render: () => (
    <ModalSideDemo
      width="normal"
      title="Lorem Ipsum"
      actionLabel="Lorem Ipsum"
      triggerLabel="Abrir normal"
    >
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**Width — small (300px)** · _inclui captura do estado aberto no HTML_

```tsx
export const WidthSmall: Story = {
  name: 'Width — small (300px)',
  render: () => (
    <ModalSideDemo
      width="small"
      title="Lorem Ipsum"
      actionLabel="Lorem Ipsum"
      triggerLabel="Abrir pequeno"
    >
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**Without footer** · _inclui captura do estado aberto no HTML_

```tsx
export const NoFooter: Story = {
  name: 'Without footer',
  render: () => (
    <ModalSideDemo title="Visualização">
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**With Secondary Button** · _inclui captura do estado aberto no HTML_

```tsx
export const WithSecondaryButton: Story = {
  render: () => (
    <ModalSideDemo
      title="Confirmar ação"
      secondaryLabel="Cancelar"
      actionLabel="Confirmar"
      actionColor="confirmation"
    >
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**Footer with text** · _inclui captura do estado aberto no HTML_

```tsx
export const WithFooterText: Story = {
  name: 'Footer with text',
  render: () => (
    <ModalSideDemo
      title="Informações"
      footerText="Última atualização: hoje"
      actionLabel="Salvar"
    >
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**Brand color action** · _inclui captura do estado aberto no HTML_

```tsx
export const BrandAction: Story = {
  name: 'Brand color action',
  render: () => (
    <ModalSideDemo
      title="Novo registro"
      secondaryLabel="Cancelar"
      actionLabel="Criar"
      actionColor="brand"
      triggerLabel="Abrir (brand)"
    >
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**Scrollable content** · _inclui captura do estado aberto no HTML_

```tsx
export const ScrollableContent: Story = {
  name: 'Scrollable content',
  render: () => (
    <ModalSideDemo title="Conteúdo longo" actionLabel="Fechar" width="normal">
      <div className="flex flex-col gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="rounded-[5px] border border-neutral-level_2 p-[15px] text-sm text-font"
          >
            <p className="font-semibold">Seção {i + 1}</p>
            <p className="mt-1 text-font-level_1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        ))}
      </div>
    </ModalSideDemo>
  ),
}
```

**With Breadcrumbs** · _inclui captura do estado aberto no HTML_

```tsx
export const WithBreadcrumbs: Story = {
  render: () => (
    <ModalSideDemo
      headerLeft="breadcrumbs"
      breadcrumbItems={[
        { label: 'Início' },
        { label: 'Clientes' },
        { label: 'Detalhe' },
      ]}
      actionLabel="Salvar"
    >
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

**Right + normal (Figma variant)** · _inclui captura do estado aberto no HTML_

```tsx
export const RightNormal: Story = {
  name: 'Right + normal (Figma variant)',
  render: () => (
    <ModalSideDemo
      orientation="right"
      width="normal"
      title="Lorem Ipsum"
      actionLabel="Lorem Ipsum"
      triggerLabel="Abrir (direita, normal)"
    >
      <PlaceholderContent />
    </ModalSideDemo>
  ),
}
```

### ResizableDrawer

Visual: `organisms/ResizableDrawer.html` · stories: `ResizableDrawer.stories.tsx` (7)

```tsx
import { ResizableDrawer } from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: () => (
    <Layout>
      <ResizableDrawer defaultWidth={200}>
        <PlaceholderContent />
      </ResizableDrawer>
    </Layout>
  ),
}
```

**Collapsed**

```tsx
export const Collapsed: Story = {
  render: () => (
    <Layout>
      <ResizableDrawer defaultCollapsed>
        <PlaceholderContent />
      </ResizableDrawer>
    </Layout>
  ),
}
```

**Controlled**

```tsx
export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
```

**Min width 250px**

```tsx
export const MinWidth250: Story = {
  name: 'Min width 250px',
  render: () => (
    <Layout>
      <ResizableDrawer defaultWidth={250} minWidth={250}>
        <PlaceholderContent />
      </ResizableDrawer>
    </Layout>
  ),
}
```

**Min width 350px**

```tsx
export const MinWidth350: Story = {
  name: 'Min width 350px',
  render: () => (
    <Layout>
      <ResizableDrawer defaultWidth={350} minWidth={350}>
        <PlaceholderContent />
      </ResizableDrawer>
    </Layout>
  ),
}
```

**With real content**

```tsx
export const WithRealContent: Story = {
  name: 'With real content',
  render: () => (
    <div className="flex h-screen">
      <ResizableDrawer defaultWidth={240} minWidth={160} maxWidth={480}>
        <div className="flex flex-col gap-1 p-[10px]">
          {['Registros', 'Contatos', 'Negócios', 'Tarefas', 'Relatórios'].map(
            (item) => (
              <button
                key={item}
                type="button"
                className="flex h-[35px] w-full items-center rounded-[5px] px-[10px] text-left text-sm text-font hover:bg-neutral-level_1"
              >
                {item}
              </button>
            ),
          )}
        </div>
      </ResizableDrawer>
      <div className="flex flex-1 items-center justify-center bg-background text-sm text-font-level_2">
        Main content
      </div>
    </div>
  ),
  // … +1 linhas — ver o arquivo da story
```

**All Figma variants**

```tsx
export const AllVariants: Story = {
  name: 'All Figma variants',
  render: () => (
    <div className="flex gap-[40px] p-[40px] bg-neutral-level_1">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-font-level_2">Collapsed</p>
        <div className="flex h-[400px] overflow-visible">
          <ResizableDrawer defaultCollapsed>
            <PlaceholderContent />
          </ResizableDrawer>
          <div className="w-[100px] bg-background border border-neutral-level_2" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-font-level_2">200px</p>
        <div className="flex h-[400px] overflow-visible">
          <ResizableDrawer defaultWidth={200}>
            <PlaceholderContent />
          </ResizableDrawer>
          <div className="w-[100px] bg-background border border-neutral-level_2 border-l-0" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-font-level_2">250px</p>
  // … +19 linhas — ver o arquivo da story
```

### SearchableList

Visual: `organisms/SearchableList.html` · stories: `SearchableList.stories.tsx` (7)

```tsx
import { SearchableList } from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: () => (
    <SearchableList title="Lorem Ipsum" onClose={() => {}} items={baseItems} />
  ),
}
```

**Search focused (pre-filled)**

```tsx
export const SearchFocused: Story = {
  name: 'Search focused (pre-filled)',
  render: () => (
    <SearchableList
      title="Lorem Ipsum"
      onClose={() => {}}
      items={baseItems}
      defaultSearchValue="e"
    />
  ),
}
```

**No search results**

```tsx
export const NoResults: Story = {
  name: 'No search results',
  render: () => (
    <SearchableList
      title="Lorem Ipsum"
      onClose={() => {}}
      items={baseItems}
      defaultSearchValue="zzz"
    />
  ),
}
```

**Items without menu**

```tsx
export const NoMenuButtons: Story = {
  name: 'Items without menu',
  render: () => (
    <SearchableList
      title="Campos disponíveis"
      onClose={() => {}}
      items={baseItems.map(({ onMenuClick: _, ...item }) => item)}
    />
  ),
}
```

**Many items (scrollable)**

```tsx
export const ManyItems: Story = {
  name: 'Many items (scrollable)',
  render: () => (
    <SearchableList
      title="Selecionar campo"
      onClose={() => {}}
      items={Array.from({ length: 15 }, (_, i) => ({
        id: i,
        icon: <TextIcon />,
        label: `Campo ${i + 1}`,
        onMenuClick: i < 5 ? () => {} : undefined,
      }))}
    />
  ),
}
```

**Without title**

```tsx
export const NoTitle: Story = {
  name: 'Without title',
  render: () => <SearchableList items={baseItems} />,
}
```

**All Figma variants**

```tsx
export const AllVariants: Story = {
  name: 'All Figma variants',
  render: () => (
    <div className="flex items-start gap-[30px]">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-font-level_2">Default (searchFocus=false)</p>
        <SearchableList
          title="Lorem Ipsum"
          onClose={() => {}}
          items={baseItems}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-font-level_2">Search focused</p>
        <SearchableList
          title="Lorem Ipsum"
          onClose={() => {}}
          items={baseItems}
          defaultSearchValue="e"
        />
      </div>
    </div>
  ),
}
```

### Stepper

Visual: `organisms/Stepper.html` · stories: `Stepper.stories.tsx` (8)

```tsx
import { Stepper } from '@ploomescrm/ui';
```

**Default**

```tsx
export const Default: Story = {
  render: () => <Stepper steps={defaultSteps} activeStep={0} color="brand" />,
}
```

**Interactive (click to advance)**

```tsx
export const Interactive: Story = {
  name: 'Interactive (click to advance)',
  render: () => <InteractiveDemo />,
}
```

**Color — brand (purple)**

```tsx
export const ColorBrand: Story = {
  name: 'Color — brand (purple)',
  render: () => (
    <div className="flex flex-col gap-[15px]">
      {defaultSteps.map((_, active) => (
        <Stepper
          key={active}
          steps={defaultSteps}
          activeStep={active}
          color="brand"
        />
      ))}
    </div>
  ),
}
```

**Color — success (green)**

```tsx
export const ColorSuccess: Story = {
  name: 'Color — success (green)',
  render: () => (
    <div className="flex flex-col gap-[15px]">
      {defaultSteps.map((_, active) => (
        <Stepper
          key={active}
          steps={defaultSteps}
          activeStep={active}
          color="success"
        />
      ))}
    </div>
  ),
}
```

**Color — danger (red)**

```tsx
export const ColorDanger: Story = {
  name: 'Color — danger (red)',
  render: () => (
    <div className="flex flex-col gap-[15px]">
      {defaultSteps.map((_, active) => (
        <Stepper
          key={active}
          steps={defaultSteps}
          activeStep={active}
          color="danger"
        />
      ))}
    </div>
  ),
}
```

**All Figma variants**

```tsx
export const AllVariants: Story = {
  name: 'All Figma variants',
  render: () => (
    <div className="flex flex-col gap-[30px]">
      {[0, 2, 4].map((active) => (
        <Stepper
          key={`brand-${active}`}
          steps={defaultSteps}
          activeStep={active}
          color="brand"
        />
      ))}
      {[0, 2, 4].map((active) => (
        <Stepper
          key={`success-${active}`}
          steps={defaultSteps}
          activeStep={active}
          color="success"
        />
      ))}
      {[0, 2, 4].map((active) => (
        <Stepper
          key={`danger-${active}`}
          steps={defaultSteps}
  // … +7 linhas — ver o arquivo da story
```

**3 steps**

```tsx
export const ThreeSteps: Story = {
  name: '3 steps',
  render: () => (
    <div className="flex flex-col gap-[15px]">
      {['Início', 'Processamento', 'Conclusão'].map((_, active, arr) => {
        const steps = arr.map((__, i) => ({
          id: i,
          label: ['Início', 'Processamento', 'Conclusão'][i],
        }));
        return (
          <Stepper
            key={active}
            steps={steps}
            activeStep={active}
            color="brand"
          />
        );
      })}
    </div>
  ),
}
```

**2 steps**

```tsx
export const TwoSteps: Story = {
  name: '2 steps',
  render: () => {
    const steps = [
      { id: 1, label: 'Início' },
      { id: 2, label: 'Fim' },
    ];
    return (
      <div className="flex flex-col gap-[15px]">
        <Stepper steps={steps} activeStep={0} color="brand" />
        <Stepper steps={steps} activeStep={1} color="brand" />
      </div>
    );
  },
}
```

### SubMenuHorizontal

Visual: `organisms/SubMenuHorizontal.html` · stories: `SubMenuHorizontal.stories.tsx` (7)

```tsx
import {
  SubMenuHorizontal,
  SubMenuSearch,
  ButtonSoft,
  ButtonAction,
} from '@ploomescrm/ui';
```

**Left — null (right only)**

```tsx
export const LeftNull: Story = {
  name: 'Left — null (right only)',
  render: () => <SubMenuHorizontal right={<RightActions />} />,
}
```

**Left — search**

```tsx
export const LeftSearch: Story = {
  name: 'Left — search',
  render: () => (
    <SubMenuHorizontal
      left={<SubMenuSearch placeholder="Buscar..." />}
      right={<RightActions />}
    />
  ),
}
```

**Left — text items**

```tsx
export const LeftText: Story = {
  name: 'Left — text items',
  render: () => (
    <SubMenuHorizontal
      left={
        <div className="flex items-center gap-[5px]">
          <span className="text-[14px] text-font">Lorem Ipsum Lorem Ipsum</span>
          <span className="text-[14px] text-font">Lorem Ipsum Lorem Ipsum</span>
        </div>
      }
      right={<RightActions />}
    />
  ),
}
```

**Left — tabs**

```tsx
export const LeftTabs: Story = {
  name: 'Left — tabs',
  render: () => (
    <SubMenuHorizontal
      tabs={tabItems}
      defaultActiveTab="todos"
      right={<RightActions />}
    />
  ),
}
```

**Left — tabs (interactive)**

```tsx
export const TabsInteractive: Story = {
  name: 'Left — tabs (interactive)',
  render: () => <TabsInteractiveDemo />,
}
```

**Tabs only (no right content)**

```tsx
export const NoRightContent: Story = {
  name: 'Tabs only (no right content)',
  render: () => <SubMenuHorizontal tabs={tabItems} defaultActiveTab="ativos" />,
}
```

**All Figma variants**

```tsx
export const AllVariants: Story = {
  name: 'All Figma variants',
  render: () => (
    <div className="flex flex-col">
      <SubMenuHorizontal right={<RightActions />} />
      <SubMenuHorizontal
        left={<SubMenuSearch placeholder="Buscar..." />}
        right={<RightActions />}
      />
      <SubMenuHorizontal
        left={
          <div className="flex items-center gap-[5px]">
            <span className="text-[14px] text-font">
              Lorem Ipsum Lorem Ipsum
            </span>
            <span className="text-[14px] text-font">
              Lorem Ipsum Lorem Ipsum
            </span>
          </div>
        }
        right={<RightActions />}
      />
      <SubMenuHorizontal
        tabs={tabItems}
  // … +6 linhas — ver o arquivo da story
```

### Table

Visual: `organisms/Table.html` · stories: `Table.stories.tsx` (9)

```tsx
import { Table, Badge } from '@ploomescrm/ui';
```

**Rows — default (no hover)**

```tsx
export const RowsDefault: Story = {
  name: 'Rows — default (no hover)',
  render: () => <Table columns={defaultColumns} rows={sampleRows} />,
}
```

**Rows — hoverable**

```tsx
export const RowsHoverable: Story = {
  name: 'Rows — hoverable',
  render: () => <Table columns={defaultColumns} rows={sampleRows} hoverable />,
}
```

**Columns — default (no hover)**

```tsx
export const ColumnsDefault: Story = {
  name: 'Columns — default (no hover)',
  render: () => (
    <Table columns={simpleColumns} rows={sampleRows} orientation="columns" />
  ),
}
```

**Columns — hoverable**

```tsx
export const ColumnsHoverable: Story = {
  name: 'Columns — hoverable',
  render: () => (
    <Table
      columns={simpleColumns}
      rows={sampleRows}
      orientation="columns"
      hoverable
    />
  ),
}
```

**No header**

```tsx
export const NoHeader: Story = {
  name: 'No header',
  render: () => (
    <Table columns={simpleColumns} rows={sampleRows} showHeader={false} />
  ),
}
```

**Clickable rows**

```tsx
export const ClickableRows: Story = {
  name: 'Clickable rows',
  render: () => <ClickableRowsDemo />,
}
```

**Flexible column widths**

```tsx
export const FlexColumns: Story = {
  name: 'Flexible column widths',
  render: () => (
    <Table
      columns={[
        { key: 'name', header: 'Nome' },
        { key: 'email', header: 'E-mail' },
        { key: 'role', header: 'Cargo' },
        { key: 'status', header: 'Status' },
      ]}
      rows={sampleRows}
      hoverable
    />
  ),
}
```

**With footer (header + body + footer aligned)**

```tsx
export const WithFooter: Story = {
  name: 'With footer (header + body + footer aligned)',
  render: () => (
    <Table
      columns={[
        { key: 'name', header: 'Produto' },
        { key: 'role', header: 'Quantidade', width: 140 },
        { key: 'score', header: 'Valor', width: 120 },
      ]}
      rows={sampleRows}
      footer={[
        { key: 'label', content: 'Subtotal', colSpan: 2 },
        { key: 'total', content: '412', align: 'left' },
      ]}
    />
  ),
}
```

**All Figma variants**

```tsx
export const AllVariants: Story = {
  name: 'All Figma variants',
  render: () => (
    <div className="flex flex-col gap-[30px]">
      <div>
        <p className="mb-[8px] text-[12px] text-font-level_2">
          orientation=Rows, hoverable=False
        </p>
        <Table columns={simpleColumns} rows={sampleRows} />
      </div>
      <div>
        <p className="mb-[8px] text-[12px] text-font-level_2">
          orientation=Rows, hoverable=True
        </p>
        <Table columns={simpleColumns} rows={sampleRows} hoverable />
      </div>
      <div>
        <p className="mb-[8px] text-[12px] text-font-level_2">
          orientation=Columns, hoverable=False
        </p>
        <Table
          columns={simpleColumns}
          rows={sampleRows}
          orientation="columns"
  // … +16 linhas — ver o arquivo da story
```

### VerticalMenu

Visual: `organisms/VerticalMenu.html` · stories: `VerticalMenu.stories.tsx` (5)

```tsx
import { VerticalMenu } from '@ploomescrm/ui';
```

**Expanded (Short=False)**

```tsx
export const Expanded: Story = {
  name: 'Expanded (Short=False)',
  render: () => (
    <div className="h-[600px]">
      <VerticalMenu
        items={items}
        defaultActiveId="dashboard"
        logo={<PloomesLogo />}
      />
    </div>
  ),
}
```

**Collapsed (Short=True)**

```tsx
export const Collapsed: Story = {
  name: 'Collapsed (Short=True)',
  render: () => (
    <div className="h-[600px]">
      <VerticalMenu
        items={items}
        defaultActiveId="contacts"
        defaultCollapsed
        logo={<PloomesLogo />}
      />
    </div>
  ),
}
```

**Interactive (toggle + active)**

```tsx
export const Interactive: Story = {
  name: 'Interactive (toggle + active)',
  render: () => <InteractiveDemo />,
}
```

**Badge item (active)**

```tsx
export const WithBadge: Story = {
  name: 'Badge item (active)',
  render: () => (
    <div className="h-[600px]">
      <VerticalMenu
        items={items}
        defaultActiveId="reports"
        logo={<PloomesLogo />}
      />
    </div>
  ),
}
```

**All Figma variants**

```tsx
export const AllVariants: Story = {
  name: 'All Figma variants',
  render: () => (
    <div className="flex h-[600px] gap-[20px]">
      <VerticalMenu
        items={items}
        defaultActiveId="dashboard"
        logo={<PloomesLogo />}
      />
      <VerticalMenu
        items={items}
        defaultActiveId="contacts"
        defaultCollapsed
        logo={<PloomesLogo />}
      />
    </div>
  ),
}
```

## Providers

### IconProvider

Visual: `providers/IconProvider.html` · stories: `IconProvider.stories.tsx` (4)

```tsx
import {
  Breadcrumbs,
  ButtonCheck,
  Collapse,
  HeaderModal,
  Icon,
  IconProvider,
  Pagination,
  SearchInput,
  type IconOverrides,
} from '@ploomescrm/ui';
```

**Defaults**

```tsx
export const Defaults: Story = {
  render: () => <Showcase label="No provider — Lucide defaults" />,
}
```

**With Font Awesome**

```tsx
export const WithFontAwesome: Story = {
  render: () => (
    <IconProvider icons={faIcons}>
      <Showcase label="IconProvider — FontAwesome" />
    </IconProvider>
  ),
}
```

**Side By Side**

```tsx
export const SideBySide: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
      <Showcase label="Lucide (default)" />
      <IconProvider icons={faIcons}>
        <Showcase label="FontAwesome (provider)" />
      </IconProvider>
    </div>
  ),
}
```

**Nested Override**

```tsx
export const NestedOverride: Story = {
  render: () => (
    <IconProvider icons={faIcons}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon icon="chevronDown" size="normal_20" />
          <span style={{ fontSize: 11, color: '#888' }}>
            outer (fa-angle-down)
          </span>
        </div>
        <IconProvider
          icons={{ chevronDown: <FontAwesomeIcon icon={faAngleRight} /> }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon icon="chevronDown" size="normal_20" />
            <span style={{ fontSize: 11, color: '#888' }}>
              inner (fa-angle-right)
            </span>
          </div>
        </IconProvider>
      </div>
    </IconProvider>
  ),
}
```
