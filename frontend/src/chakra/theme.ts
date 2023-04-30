import {extendTheme, ThemeConfig} from '@chakra-ui/react'

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false
}

export const theme = extendTheme({config}, {
    colors: {
        brand: {
            100: "#F51997",
            200: "#b61270",
        },
    },
    styles: {
        global: () => ({
            body: {
                bg: 'whiteAlpha.200'
            },
            p: {
                // color: 'blackAlpha.600'
            }
        })
    }
});