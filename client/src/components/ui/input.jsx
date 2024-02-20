import * as React from "react"
import { Icon } from "@iconify/react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    type === "password" ?
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
          {showPassword ? (
            <Icon
              icon="streamline:visible-solid"
              className="h-4 w-4"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <Icon
              icon="streamline:invisible-1-solid"
              className="h-4 w-4"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
      </div>
      :
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props} />
  );
})
Input.displayName = "Input"

export { Input }
