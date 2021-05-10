import React from 'react'

export default function AuthLayout({children}) {
    return (
        <div className="authLayout">
            <div className="bg-white p-5 shadow rounded-xl-md h-100vh-sm">
                {children}
            </div>
        </div>
    )
}
