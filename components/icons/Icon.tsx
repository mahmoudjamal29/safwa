// import React, { SVGProps } from 'react'

// import * as Icons from './index'

// interface IconProps extends SVGProps<SVGSVGElement> {
//   className?: string
//   icon: keyof typeof Icons
//   size?: number
// }

// const Icon: React.FC<IconProps> = ({
//   className = '',
//   icon,
//   size = 19,
//   ...props
// }) => {
//   const IconComponent = Icons[icon]

//   if (!IconComponent) {
//     console.warn(`Icon "${icon}" not found`)
//     return null
//   }

//   return (
//     <IconComponent
//       {...props}
//       className={className}
//       height={size}
//       style={{
//         height: size,
//         verticalAlign: 'middle',
//         width: size,
//         ...props.style
//       }}
//       width={size}
//     />
//   )
// }

// export default Icon
