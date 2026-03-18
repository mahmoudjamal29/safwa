'use client'

import React from 'react'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cva } from 'class-variance-authority'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/utils/index'

const treeVariants = cva(
  'group hover:before:opacity-100 before:absolute before:rounded-lg before:left-0 px-2 before:w-full before:opacity-0 before:bg-accent/70 before:h-[2rem] before:-z-10'
)

const selectedTreeVariants = cva(
  'before:opacity-100 before:bg-accent/70 text-accent-foreground'
)

const dragOverVariants = cva(
  'before:opacity-100 before:bg-primary/20 text-primary-foreground'
)

interface TreeDataItem {
  actions?: React.ReactNode
  children?: TreeDataItem[]
  className?: string
  disabled?: boolean
  draggable?: boolean
  droppable?: boolean
  icon?: React.ComponentType<{ className?: string }>
  id: string
  name: string
  onClick?: () => void
  openIcon?: React.ComponentType<{ className?: string }>
  selectedIcon?: React.ComponentType<{ className?: string }>
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem | TreeDataItem[]
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  expandAll?: boolean
  initialSelectedItemId?: string
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
  onSelectChange?: (item: TreeDataItem | undefined) => void
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
}

type TreeRenderItemParams = {
  hasChildren: boolean
  isLeaf: boolean
  isOpen?: boolean
  isSelected: boolean
  item: TreeDataItem
  level: number
}

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      className,
      data,
      defaultLeafIcon,
      defaultNodeIcon,
      expandAll,
      initialSelectedItemId,
      onDocumentDrag,
      onSelectChange,
      renderItem,
      ...props
    },
    ref
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<
      string | undefined
    >(initialSelectedItemId)

    const [draggedItem, setDraggedItem] = React.useState<null | TreeDataItem>(
      null
    )

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id)
        if (onSelectChange) {
          onSelectChange(item)
        }
      },
      [onSelectChange]
    )

    const handleDragStart = React.useCallback((item: TreeDataItem) => {
      setDraggedItem(item)
    }, [])

    const handleDrop = React.useCallback(
      (targetItem: TreeDataItem) => {
        if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
          onDocumentDrag(draggedItem, targetItem)
        }
        setDraggedItem(null)
      },
      [draggedItem, onDocumentDrag]
    )

    const expandedItemIds = React.useMemo(() => {
      if (!initialSelectedItemId) {
        return [] as string[]
      }

      const ids: string[] = []

      function walkTreeItems(
        items: TreeDataItem | TreeDataItem[],
        targetId: string
      ) {
        if (Array.isArray(items)) {
          for (let i = 0; i < items.length; i++) {
            ids.push(items[i].id)
            if (walkTreeItems(items[i], targetId) && !expandAll) {
              return true
            }
            if (!expandAll) ids.pop()
          }
        } else if (!expandAll && items.id === targetId) {
          return true
        } else if (items.children) {
          return walkTreeItems(items.children, targetId)
        }
      }

      walkTreeItems(data, initialSelectedItemId)
      return ids
    }, [data, expandAll, initialSelectedItemId])

    return (
      <div className={cn('relative overflow-hidden p-2', className)}>
        <TreeItem
          data={data}
          defaultLeafIcon={defaultLeafIcon}
          defaultNodeIcon={defaultNodeIcon}
          draggedItem={draggedItem}
          expandedItemIds={expandedItemIds}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          handleSelectChange={handleSelectChange}
          level={0}
          ref={ref}
          renderItem={renderItem}
          selectedItemId={selectedItemId}
          {...props}
        />
        {/* <div
                    className='w-full h-[48px]'
                    onDrop={() => { handleDrop({ id: '', name: 'parent_div' }) }}>
                </div> */}
      </div>
    )
  }
)
TreeView.displayName = 'TreeView'

type TreeItemProps = TreeProps & {
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  draggedItem: null | TreeDataItem
  expandedItemIds: string[]
  handleDragStart?: (item: TreeDataItem) => void
  handleDrop?: (item: TreeDataItem) => void
  handleSelectChange: (item: TreeDataItem | undefined) => void
  level?: number
  selectedItemId?: string
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      defaultLeafIcon,
      defaultNodeIcon,
      draggedItem,
      expandAll,
      expandedItemIds,
      handleDragStart,
      handleDrop,
      handleSelectChange,
      initialSelectedItemId,
      level,
      onDocumentDrag,
      onSelectChange,
      renderItem,
      selectedItemId,
      ...props
    },
    ref
  ) => {
    if (!Array.isArray(data)) {
      data = [data]
    }
    return (
      <div className={className} ref={ref} role="tree" {...props}>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <TreeNode
                  defaultLeafIcon={defaultLeafIcon}
                  defaultNodeIcon={defaultNodeIcon}
                  draggedItem={draggedItem}
                  expandedItemIds={expandedItemIds}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  handleSelectChange={handleSelectChange}
                  item={item}
                  level={level ?? 0}
                  renderItem={renderItem}
                  selectedItemId={selectedItemId}
                />
              ) : (
                <TreeLeaf
                  defaultLeafIcon={defaultLeafIcon}
                  draggedItem={draggedItem}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  handleSelectChange={handleSelectChange}
                  item={item}
                  level={level ?? 0}
                  renderItem={renderItem}
                  selectedItemId={selectedItemId}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
)
TreeItem.displayName = 'TreeItem'

const TreeNode = ({
  defaultLeafIcon,
  defaultNodeIcon,
  draggedItem,
  expandedItemIds,
  handleDragStart,
  handleDrop,
  handleSelectChange,
  item,
  level = 0,
  renderItem,
  selectedItemId
}: {
  defaultLeafIcon?: React.ComponentType<{ className?: string }>
  defaultNodeIcon?: React.ComponentType<{ className?: string }>
  draggedItem: null | TreeDataItem
  expandedItemIds: string[]
  handleDragStart?: (item: TreeDataItem) => void
  handleDrop?: (item: TreeDataItem) => void
  handleSelectChange: (item: TreeDataItem | undefined) => void
  item: TreeDataItem
  level?: number
  renderItem?: (params: TreeRenderItemParams) => React.ReactNode
  selectedItemId?: string
}) => {
  const [value, setValue] = React.useState(
    expandedItemIds.includes(item.id) ? [item.id] : []
  )
  const [isDragOver, setIsDragOver] = React.useState(false)
  const hasChildren = !!item.children?.length
  const isSelected = selectedItemId === item.id
  const isOpen = value.includes(item.id)

  const onDragStart = (e: React.DragEvent) => {
    if (!item.draggable) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', item.id)
    handleDragStart?.(item)
  }

  const onDragOver = (e: React.DragEvent) => {
    if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
      e.preventDefault()
      setIsDragOver(true)
    }
  }

  const onDragLeave = () => {
    setIsDragOver(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleDrop?.(item)
  }

  return (
    <AccordionPrimitive.Root
      onValueChange={(s) => {
        if (hasChildren) {
          setValue(s)
        }
      }}
      type="multiple"
      value={hasChildren ? value : []}
    >
      <AccordionPrimitive.Item value={item.id}>
        <AccordionTrigger
          className={cn(
            'py-1.5',
            treeVariants(),
            isSelected && selectedTreeVariants(),
            isDragOver && dragOverVariants(),
            item.className
          )}
          draggable={!!item.draggable}
          hasChildren={hasChildren}
          onClick={() => {
            handleSelectChange(item)
            item.onClick?.()
          }}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
        >
          {renderItem ? (
            renderItem({
              hasChildren,
              isLeaf: false,
              isOpen,
              isSelected,
              item,
              level
            })
          ) : (
            <>
              <TreeIcon
                default={defaultNodeIcon}
                isOpen={isOpen}
                isSelected={isSelected}
                item={item}
              />
              <span className="truncate text-sm">{item.name}</span>
              <TreeActions isSelected={isSelected}>{item.actions}</TreeActions>
            </>
          )}
        </AccordionTrigger>
        <AccordionContent className="ml-4 border-l pl-1">
          <TreeItem
            data={item.children ? item.children : item}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            draggedItem={draggedItem}
            expandedItemIds={expandedItemIds}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            handleSelectChange={handleSelectChange}
            level={level + 1}
            renderItem={renderItem}
            selectedItemId={selectedItemId}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}

const TreeLeaf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultLeafIcon?: React.ComponentType<{ className?: string }>
    draggedItem: null | TreeDataItem
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    handleSelectChange: (item: TreeDataItem | undefined) => void
    item: TreeDataItem
    level: number
    renderItem?: (params: TreeRenderItemParams) => React.ReactNode
    selectedItemId?: string
  }
>(
  (
    {
      className,
      defaultLeafIcon,
      draggedItem,
      handleDragStart,
      handleDrop,
      handleSelectChange,
      item,
      level,
      renderItem,
      selectedItemId,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const isSelected = selectedItemId === item.id

    const onDragStart = (e: React.DragEvent) => {
      if (!item.draggable || item.disabled) {
        e.preventDefault()
        return
      }
      e.dataTransfer.setData('text/plain', item.id)
      handleDragStart?.(item)
    }

    const onDragOver = (e: React.DragEvent) => {
      if (
        item.droppable !== false &&
        !item.disabled &&
        draggedItem &&
        draggedItem.id !== item.id
      ) {
        e.preventDefault()
        setIsDragOver(true)
      }
    }

    const onDragLeave = () => {
      setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
      if (item.disabled) return
      e.preventDefault()
      setIsDragOver(false)
      handleDrop?.(item)
    }

    return (
      <div
        className={cn(
          level > 0 && 'ml-2',
          'flex cursor-pointer items-center py-0 text-left before:right-1',
          treeVariants(),
          className,
          isSelected && selectedTreeVariants(),
          isDragOver && dragOverVariants(),
          item.disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          item.className
        )}
        draggable={!!item.draggable && !item.disabled}
        onClick={() => {
          if (item.disabled) return
          handleSelectChange(item)
          item.onClick?.()
        }}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        onDrop={onDrop}
        ref={ref}
        {...props}
      >
        {renderItem ? (
          <>
            <div className="mr-1 h-4 w-4 shrink-0" />
            {renderItem({
              hasChildren: false,
              isLeaf: true,
              isSelected,
              item,
              level
            })}
          </>
        ) : (
          <>
            <TreeIcon
              default={defaultLeafIcon}
              isSelected={isSelected}
              item={item}
            />
            <span className="grow truncate text-sm">{item.name}</span>
            <TreeActions isSelected={isSelected && !item.disabled}>
              {item.actions}
            </TreeActions>
          </>
        )}
      </div>
    )
  }
)
TreeLeaf.displayName = 'TreeLeaf'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    hasChildren?: boolean
  }
>(({ children, className, hasChildren = true, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      className={cn(
        'flex w-full flex-1 items-center py-2 transition-all first:[&[data-state=open]>svg]:first-of-type:rotate-90',
        className
      )}
      disabled={!hasChildren}
      ref={ref}
      {...props}
    >
      {hasChildren && (
        <ChevronRight className="text-accent-foreground/50 mr-1 h-4 w-4 shrink-0 transition-transform duration-200" />
      )}
      {!hasChildren && <div className="mr-1 h-4 w-4 shrink-0" />}
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Content
    className={cn(
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all',
      className
    )}
    ref={ref}
    {...props}
  >
    <div className="pt-0 pb-1">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const TreeIcon = ({
  default: defaultIcon,
  isOpen,
  isSelected,
  item
}: {
  default?: React.ComponentType<{ className?: string }>
  isOpen?: boolean
  isSelected?: boolean
  item: TreeDataItem
}) => {
  let Icon: React.ComponentType<{ className?: string }> | undefined =
    defaultIcon
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon
  } else if (item.icon) {
    Icon = item.icon
  }
  return Icon ? <Icon className="mr-2 h-4 w-4 shrink-0" /> : <></>
}

const TreeActions = ({
  children,
  isSelected
}: {
  children: React.ReactNode
  isSelected: boolean
}) => {
  return (
    <div
      className={cn(
        isSelected ? 'block' : 'hidden',
        'absolute right-3 group-hover:block'
      )}
    >
      {children}
    </div>
  )
}

export {
  AccordionContent,
  AccordionTrigger,
  type TreeDataItem,
  TreeItem,
  TreeLeaf,
  TreeNode,
  type TreeRenderItemParams,
  TreeView
}
